import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatSlider } from '@angular/material/slider';
import { MatOption, MatSelect } from '@angular/material/select';

interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  nullValidator?: boolean;
}

interface JsonFormControlOptions {
  min?: string;
  max?: string;
  step?: string;
  icon?: string;
  options?: string[];
}

interface JsonFormControls {
  name: string;
  label: string;
  value: string;
  type: string;
  options?: JsonFormControlOptions;
  required?: boolean;
  validators: JsonFormValidators;
}

export interface JsonFormData {
  controls: JsonFormControls[];
}



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
  controls: JsonFormControls[] =[];

  constructor(
    public ds: DataService,
    private fb: FormBuilder
  ) {
    if (ds.serviceInfo?.instructionsSchema) this.loadSchema(ds.serviceInfo.instructionsSchema);
  }


  createForm(controls: JsonFormControls[]) {
    for (const control of controls) {
      const validatorsToAdd = [];

      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }

      this.form.addControl(
        control.name,
        this.fb.control(control.value, validatorsToAdd)
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

  convertJsonSchemaToJsonForms(schema: unknown): JsonFormControls[] | string {
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
      .map(([id, prop]): JsonFormControls => ({
        name: id,
        label: prop.title || id,
        value: prop.type,
        type: chooseControl(prop),
        validators: {
          required: required.includes(id)
        },
        options: {
          options: prop.enum || undefined,
        }
      }));
  }

  submit() {
    console.log(this.form.getRawValue());

  }
}
