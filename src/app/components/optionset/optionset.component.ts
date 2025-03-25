import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { JsonFormControl } from '../../interfaces/optionset.interfaces';
import { StatusPipe } from '../../pipe/status.pipe';
import { ControlComponent } from '../control/control.component';
import { getValues, JSONSchemaToJSONForms } from '../../functions/optionset';

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
  errors: any[] = [];
  controls: JsonFormControl[] = [];

  constructor(
    public ds: DataService
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
  }

  submit() {
    const values = getValues(this.controls);
    this.ds.patchTaskInstructions(values);
  }

  protected readonly Object = Object;
}
