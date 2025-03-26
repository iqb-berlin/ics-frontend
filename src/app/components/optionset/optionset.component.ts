import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { JsonFormControl } from '../../interfaces/optionset.interfaces';
import { StatusPipe } from '../../pipe/status.pipe';
import { ControlComponent } from '../control/control.component';
import { getValues, JSONSchemaToJSONForms } from '../../functions/optionset';
import {JSONSchema, TaskTypeInfo} from '../../interfaces/api.interfaces';

@Component({
  selector: 'app-optionset',
  imports: [
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
  instructions: TaskTypeInfo | null = null

  constructor(
    public ds: DataService
  ) {
    this.loadSchema();
  }

  loadSchema(): void {
    this.errors = [];
    this.controls = [];
    this.instructions = null;
    try {
      this.instructions = this.ds.serviceInfo?.taskTypes[this.ds.task?.type || 'undefined'] || null;
      if (!this.instructions) throw `No schema given for: ${this.ds.task?.type}`;
      this.controls = JSONSchemaToJSONForms(this.instructions.instructionsSchema, this.ds.task?.instructions || {});
    } catch (e) {
      this.errors.push(e);
    }
  }

  submit() {
    const values = getValues(this.controls);
    this.ds.patchTaskInstructions(values);
  }

  protected readonly Object = Object;
}
