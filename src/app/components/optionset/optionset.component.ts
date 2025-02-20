import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';



@Component({
  selector: 'app-optionset',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMatFormFieldModule,
    CommonModule,
    MatButton
  ],
  templateUrl: './optionset.component.html',
  styleUrl: './optionset.component.css'
})
export class OptionsetComponent {
  testSchema = {
    "$id": "example",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
      "model": {
        "type": "string",
        "enum": [
          "A",
          "B"
        ]
      }
    },
    "required": [
      "model"
    ],
    "title": "ISCSInstructionsSchema",
    "type": "object"
  };

  form: FormGroup = new FormGroup({});
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  errors: any[] = [];

  constructor(
    public ds: DataService,
    private formlyJsonschema: FormlyJsonschema
  ) {
    if (ds.serviceInfo?.instructionsSchema) this.loadSchema(ds.serviceInfo.instructionsSchema);
  }

  loadSchema(schema: object): void {
    this.form = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(schema)];
  }

  submit() {
    console.log(Object.keys(this.form.controls));
    this.errors = Object.keys(this.form.controls)
      .flatMap(key => {
        const control = this.form.get(key);
        if (control && control.errors) {
          return [[key, control.errors]];
        }
        return []
      });
  }
}
