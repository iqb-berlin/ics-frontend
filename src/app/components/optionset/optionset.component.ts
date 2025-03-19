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
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatSlider } from '@angular/material/slider';
import { MatOption, MatSelect } from '@angular/material/select';
import { JsonFormControl, JsonFormValidators } from '../../interfaces/optionset.interfaces';
import { JSONSchema7TypeName } from 'json-schema';

@Component({
  selector: 'app-optionset',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatLabel,
    MatInput,
    MatCheckbox,
    MatFormField,
    MatButton,
    MatSlider,
    MatSelect,
    MatOption,
    MatError
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

  loadSchema(schema: object): void {
    const controls = this.convertJsonSchemaToJsonForms(schema);
    if (typeof controls === 'string') {
      this.errors.push(controls);
      return;
    }
    this.controls = controls;
    this.createForm(controls);
  }

  convertJsonSchemaToJsonForms(schema: unknown): JsonFormControl[] | string {
    if ((typeof schema !== 'object') || (schema == null)) return 'invalid schema';
    if (!('type' in schema)) return 'Property "type" is required';
    if (schema.type !== 'object') return 'Property "type" is required';
    const required = (('required' in schema) && (Array.isArray(schema.required))) ? schema.required : [];
    if (!('properties' in schema)) return 'Property "properties" is required';
    if ((typeof schema.properties !== 'object') || (schema.properties == null)) return 'Property "properties" mus be array';
    const chooseControl = (prop: { type: string, enum?: string }): string => {
      if (prop.enum) {
        return 'select';
      }
      switch (prop.type) {
        case 'string': return 'text';
        case 'number': return 'number';
        case 'boolean': return 'checkbox';
      }
      return 'textarea';
    }
    const getValue = (propId: string, propType: 'string' | 'number' | 'boolean'): string | number | boolean => {
      const value: unknown = this.ds.task?.instructions[propId];
      switch (propType) {
        case 'string': return String(value);
        case 'number': return Number(value);
        case 'boolean': return Boolean(value);
        default: return JSON.stringify(value);
      }
    }
    return Object.entries(schema.properties)
      .map(([id, prop]) => {
          if ((typeof prop !== 'object') && (prop == null)) throw new Error('Property "prop" is required');
          if ('$ref' in prop) {
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
            return [id, sel];
          }
          return [id, prop];
      })
      .map(([id, prop]): JsonFormControl => ({
        name: id,
        label: prop.title || id,
        value: getValue(id, prop.type),
        type: chooseControl(prop),
        validators: {
          required: required.includes(id),
          jsonValidate: !['number', 'boolean', 'string'].includes(prop.type),
          pattern: ('pattern' in prop) ? prop.pattern : null,
        },
        options: {
          options: prop.enum || undefined,
        },
        originalType: prop.type
      }));
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
