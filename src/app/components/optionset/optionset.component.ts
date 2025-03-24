import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import {
  isJsonSchemaProperty,
  JsonFormControl,
  JsonFormControlValueType,
  JsonFormValidators,
  JsonSchemaProperty
} from '../../interfaces/optionset.interfaces';
import { JSONSchema7TypeName } from 'json-schema';
import { StatusPipe } from '../../pipe/status.pipe';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-optionset',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButton,
    MatError,
    StatusPipe,
    ControlComponent
  ],
  templateUrl: './optionset.component.html',
  styleUrl: './optionset.component.css'
})
export class OptionsetComponent {
  form: FormGroup = new FormGroup({});
  errors: any[] = [];
  controls: JsonFormControl[] =[];

  constructor(
    public ds: DataService,
    private fb: FormBuilder
  ) {
    if (ds.serviceInfo?.instructionsSchema) this.loadSchema(ds.serviceInfo.instructionsSchema);
  }

  loadSchema(schema: object): void {
    const controls = this.convertJsonSchemaToJsonForms(schema);
    if (typeof controls === 'string') {
      this.errors.push(controls);
      return;
    }
    this.controls = controls;
    this.createForm(controls);
  }

  createForm(controls: JsonFormControl[]) {
    for (const control of controls) {
      const validators: ValidatorFn[] = Object.entries(control.validators)
        .map(([key, value]: [string, unknown]) => {
          switch (key as keyof JsonFormValidators) {
            case 'min':
              return Validators.min(Number(value));
            case 'max':
              return Validators.max(Number(value));
            case 'required':
              return value ? Validators.required : null;
            case 'requiredTrue':
              return value ? Validators.requiredTrue : null;
            case 'email':
              return value ? Validators.email : null;
            case 'minLength':
              return Validators.minLength(Number(value));
            case 'maxLength':
              return Validators.maxLength(Number(value));
            case 'pattern':
              return value ? Validators.pattern(String(value)) : null;
            case 'nullValidator':
              return value ? Validators.nullValidator : null;
            case 'jsonValidate':
              return value ?
                (control: AbstractControl): ValidationErrors | null => {
                  const value = control.value;
                  try {
                    JSON.parse(value);
                  } catch (e) {
                    if (e instanceof SyntaxError) {
                      return {'json': e.message}
                    } else {
                      return {'json-unknown': e}
                    }
                  }
                  return null;
                } :
                null;
            default:
              return null;
          }
        })
        .filter(v => !!v);
      this.form.addControl(
        control.name,
        this.fb.control(control.value, validators)
      );
    }
  }

  convertJsonSchemaToJsonForms(schema: unknown): JsonFormControl[] | string {
    const chooseControl = (prop: JsonSchemaProperty): string => {
      if (prop.enum) {
        return 'select';
      }
      switch (prop.type) {
        case 'string': return 'text';
        case 'number': return 'number';
        case 'boolean': return 'checkbox';
        case 'array': return 'array';
      }
      return 'textarea';
    }
    const getValue = (propId: string, propType: string): JsonFormControlValueType => {
      const value: unknown = this.ds.task?.instructions[propId];
      switch (propType) {
        case 'string': return String(value);
        case 'number': return Number(value);
        case 'boolean': return Boolean(value);
        case 'array': return [];
        default: return JSON.stringify(value);
      }
    }
    const propertyToJsonFormControl = ([id, prop]: [string, JsonSchemaProperty]): JsonFormControl => ({
        name: id,
        label: prop.title || id,
        value: getValue(id, prop.type),
        type: chooseControl(prop),
        arrayType: (prop.type === 'array') &&
          (typeof prop.items === 'object') &&
          (prop.items != null) &&
          ('type' in prop.items) &&
          (isJsonSchemaProperty(prop.items)) ?
            propertyToJsonFormControl(['??', prop.items]) :
            undefined,
        validators: {
          required: prop.required.includes(id),
          jsonValidate: !['number', 'boolean', 'string'].includes(prop.type),
          pattern: prop.pattern || undefined,
        },
        options: {
          options: prop.enum || undefined,
        },
        originalType: prop.type
      });

    if ((typeof schema !== 'object') ||
      (schema == null) ||
      !('properties' in  schema) ||
      !Array.isArray(schema.properties)) {
      throw 'invalid schema yaya';
    }
    return Object.entries(schema.properties)
      .map(([id, prop]: [string, unknown]): [string, JsonSchemaProperty] => {
          if ((typeof prop !== 'object') || (prop == null)) throw new Error('Property "prop" is required');
          if (('$ref' in prop) && (typeof prop.$ref === 'string')) {
            const path: string[] = prop.$ref
              .replace(/^#\//, '')
              .split('/');
            let sel: { [key: string]: any } = schema;
            let step;
            while (step = path.shift()) {
              if (!(step in sel)) throw new Error(`Can not expand path: ${prop.$ref}`);
              if (typeof sel[step] !== 'object') throw new Error(`Can not expand path: ${prop.$ref}`);
              sel = sel[step];
            }
            if (!isJsonSchemaProperty(sel)) throw `NO NO NO (${path}): ${sel}`;
            return [id, sel];
          }
          if (!isJsonSchemaProperty(prop)) throw "NO NO NO";
          return [id, prop];
      })
      .map(propertyToJsonFormControl);
  }

  submit() {
    const formRawValue: { [prop: string]: string | number | boolean } = this.form.getRawValue();
    const instructions: { [prop: string]: unknown } = {};
    const transformValue = (
      value: string | number | boolean,
      type: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined
    ) => {
      switch (type) {
        case 'string': return String(value);
        case 'number': return Number(value);
        case 'boolean': return Number(value);
        default: return JSON.parse((typeof value === 'string') ? value : '')
      }
    }
    this.controls
      .forEach(control => {
        const value = formRawValue[control.name];
        instructions[control.name] = transformValue(value, control.originalType);
      });
    this.ds.patchTaskInstructions(instructions);
  }
}
