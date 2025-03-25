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
import { JsonFormControl, JsonFormValidators } from '../../interfaces/optionset.interfaces';
import { StatusPipe } from '../../pipe/status.pipe';
import { ControlComponent } from '../control/control.component';
import { JSONSchemaToJSONForms } from '../../functions/optionset';
import { createAngularFormsControl } from '../../functions/optionset-form-builder';

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
    try {
      this.controls = JSONSchemaToJSONForms(schema, this.ds.task?.instructions || {});
    } catch (e) {
      this.controls = []
      this.errors.push(e);
    }
    this.controls
      .map(control => createAngularFormsControl(this.fb, control))
      .forEach(element => {
        this.form.addControl(
          element.name,
          element.control
        );
      });
  }

  submit() {
    const formRawValue: { [prop: string]: string | number | boolean } = this.form.getRawValue();
    console.log(formRawValue);
    const instructions: { [prop: string]: unknown } = {};
    const transformValue = (
      value: string | number | boolean,
      type: string | undefined
    ) => {
      console.log('transformValue', value, type);
      switch (type) {
        case 'string': return String(value);
        case 'number': return Number(value);
        case 'boolean': return Number(value);
        case 'array': return value;
        default: return JSON.parse((typeof value === 'string') ? value : '')
      }
    }
    this.controls
      .forEach(control => {
        instructions[control.name] = transformValue(formRawValue[control.name], control.fieldType);
      });
    this.ds.patchTaskInstructions(instructions);
  }

  protected readonly Object = Object;
}
