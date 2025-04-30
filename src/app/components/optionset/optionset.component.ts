import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { JsonFormControl } from '../../interfaces/optionset.interfaces';
import { StatusPipe } from '../../pipe/status.pipe';
import { ControlComponent } from '../control/control.component';
import { getValues, JSONSchemaToJSONForms } from '../../functions/optionset';
import { JSONSchema, TaskInstructions } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { isTaskInstructions, isServiceInfo } from 'iqbspecs-coding-service/functions/ics-api.typeguards';
import { download } from '../../functions/download';
import { distinctUntilChanged, interval, map, Subscription, takeWhile } from 'rxjs';

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
export class OptionsetComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') private fileInput: ElementRef | undefined;
  errors: any[] = [];
  controls: JsonFormControl[] = [];
  instructionsSchema: JSONSchema | null = null

  protected readonly Object = Object;
  protected readonly isServiceInfo = isServiceInfo;
  private readonly subscriptions: { [key: string]: Subscription } = { };

  constructor(
    protected ds: DataService
  ) {
    this.loadSchema();
  }

  ngOnInit(): void {
    this.subscriptions['autosave'] = interval(1000)
      .pipe(
        takeWhile(() => this.ds.status === 'create'),
        map(() => getValues(this.controls)),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => {
        this.ds.updateTask({ instructions: values });
      });
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
    } catch (e) {
      this.errors.push(e);
    }
  }

  submit(): void {
    const values = getValues(this.controls);
    this.ds.updateTask({ instructions: values });
  }

  download(): void {
    download(this.ds.task?.instructions).asJSON(this.ds.task?.label + '.instructions.json');
  }

  onFileSelected($event: Event) {
    if (
      !('target' in $event) ||
      ($event.target == null) ||
      !('files' in $event.target) ||
      !($event.target.files instanceof FileList) ||
      $event.target.files.length === 0
    ) {
      throw new Error('Upload error');
    }
    const file: File = $event.target.files[0];

    const reader = new FileReader();
    reader.onload = e => this.onFileLoad(e, file);
    reader.readAsArrayBuffer(file);
  }

  onFileLoad($event: Event, file: File) {
    if (
      !('target' in $event) ||
      ($event.target == null) ||
      !('result' in $event.target) ||
      !($event.target.result instanceof ArrayBuffer)
    ) {
      throw new Error(`Upload error (1): ${file.name}`);
    }
    const text = new TextDecoder().decode($event.target.result);
    if (!this.ds.task) throw new Error('No task found.');
    this.ds.updateTask({ instructions: this.parseFile(text) })
      .then(() => {
        this.loadSchema();
      });
  }

  parseFile(file: string): TaskInstructions {
    const o = JSON.parse(file);
    if (!isTaskInstructions(o)) throw new Error('invalid instructions file!');
    return o;
  }

  ngOnDestroy(): void {
    Object.keys(this.subscriptions)
      .forEach(subscriptionId => {
        this.subscriptions[subscriptionId].unsubscribe();
        delete this.subscriptions[subscriptionId];
      });
  }
}
