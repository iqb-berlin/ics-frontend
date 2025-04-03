import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { JsonFormControl } from '../../interfaces/optionset.interfaces';
import { StatusPipe } from '../../pipe/status.pipe';
import { ControlComponent } from '../control/control.component';
import { getValues, JSONSchemaToJSONForms } from '../../functions/optionset';
import { isServiceInfo, isTaskInstructions, JSONSchema } from '../../interfaces/api.interfaces';

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
  instructionsSchema: JSONSchema | null = null

  constructor(
    protected ds: DataService
  ) {
    this.loadSchema();
  }

  loadSchema(): void {
    this.errors = [];
    this.controls = [];
    this.instructionsSchema = null;
    if (!this.ds.task) return;
    try {
      this.instructionsSchema = this.ds.serviceInfo?.instructionsSchema || null;
      if (this.ds.task.type === 'train') {
        if (!this.instructionsSchema) throw `No schema given for: ${this.ds.task?.type}`;
        const instructions  = isTaskInstructions(this.ds.task.instructions) ? this.ds.task.instructions : {};
        this.controls = JSONSchemaToJSONForms(this.instructionsSchema, instructions);
      }
      if (this.ds.task.type === 'code') {
        if (typeof this.ds.task.instructions !== 'string') throw `Instructions of a Code-Task must contain an coderId`;

      }



    } catch (e) {
      this.errors.push(e);
    }
  }

  submit() {
    const values = getValues(this.controls);
    this.ds.updateTask({ instructions: values });
  }

  protected readonly Object = Object;
  protected readonly isServiceInfo = isServiceInfo;
}
