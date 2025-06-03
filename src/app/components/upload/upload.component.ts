import {
  Component, ElementRef, EventEmitter, Output, ViewChild
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { inferSchema, initParser } from 'udsv';
import { ResponseRow, TaskType, DataChunk } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { isResponse, isResponseList, isResponseValueType } from 'iqbspecs-coding-service/functions/iqb.typeguards';
import { isResponseRow, isResponseRowList } from 'iqbspecs-coding-service/functions/ics-api.typeguards';
import { ResponseStatusList } from 'iqbspecs-coding-service/interfaces/iqb.interfaces';
import { isA } from 'iqbspecs-coding-service/functions/common.typeguards';
import { Response, ResponseStatusType } from '@iqbspecs/response/response.interface';
import { DataService } from '../../services/data.service';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-upload',
  imports: [
    MatButton
  ],
  templateUrl: './upload.component.html',
  standalone: true,
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  @ViewChild('fileInput') private fileInput: ElementRef | undefined;
  @Output() uploaded = new EventEmitter<DataChunk>();

  constructor(
    private bs: BackendService,
    private ds: DataService
  ) {
  }

  openFileDialog(): void {
    if (this.fileInput) this.fileInput.nativeElement.click();
  }

  onFileSelected($event: Event): void {
    if (
      !('target' in $event) ||
      ($event.target == null) ||
      !('files' in $event.target) ||
      !($event.target.files instanceof FileList) ||
      $event.target.files.length === 0
    ) {
      throw new Error('Upload error (0)');
    }
    const file: File = $event.target.files[0];

    const reader = new FileReader();
    reader.onload = e => this.onFileLoad(e, file, this.ds.task?.type || 'unknown');
    reader.readAsArrayBuffer(file);
  }

  onFileLoad($event: ProgressEvent<FileReader>, file: File, taskType: TaskType) {
    if (!this.ds.task) throw new Error('No task found.');
    if (
      !('target' in $event) ||
      ($event.target == null) ||
      !('result' in $event.target) ||
      !($event.target.result instanceof ArrayBuffer)
    ) {
      throw new Error(`Upload error (1): ${file.name}`);
    }

    const text = new TextDecoder().decode($event.target.result);
    const fileContent = this.parseFile(file.name, text, taskType);
    const taskId = this.ds.task.id;
    this.bs.putTaskData(taskId, fileContent)
      .subscribe(chunk => {
        if (taskId !== this.ds.task?.id) {
          // active task changed meanwhile
          return;
        }
        this.ds.task.data.push(chunk);
        this.uploaded.emit(chunk);
      });
  }

  parseFile(fileName: string, content: string, taskType: TaskType): ResponseRow[] {
    if (fileName.toLowerCase().endsWith('.json')) return this.parseJsonFile(content);
    if (fileName.toLowerCase().endsWith('.tsv') || fileName.toLowerCase().endsWith('.csv')) return this.parseCSVFile(content, taskType);
    throw new Error(`Unknown File extension: ${fileName}`);
  }

  // eslint-disable-next-line class-methods-use-this
  parseJsonFile(content: string): ResponseRow[] {
    const contentJson: unknown = JSON.parse(content);
    if (isResponseRowList(contentJson)) {
      return contentJson;
    }
    if (isResponseList(contentJson)) {
      return contentJson.map((row: Response, index: number): ResponseRow => ({ ...row, setId: `auto:${index}` }));
    }

    if (!Array.isArray(contentJson)) {
      throw new Error('JSON import Error: Not an Array.');
    }

    contentJson
      .forEach((row, index) => {
        if (!isResponse(row) && !isResponseRow(row)) {
          throw new Error(`JSON import Error: Row #${index} is not a valid response.`);
        }
      });

    throw new Error('JSON import Error: Unknown');
  }

  // eslint-disable-next-line class-methods-use-this
  private parseCSVFile(content: string, taskType: TaskType): ResponseRow[] {
    const schema = inferSchema(content, { trim: true });
    if (!schema.cols.find(col => col.name === 'value')) throw new Error('no value column given');
    if (!schema.cols.find(col => col.name === 'code') && (taskType === 'train')) throw new Error('no code column given'); // TODO only for training
    const parser = initParser(schema);
    const typedObjs = parser.typedObjs(content);
    return typedObjs
      .map((t: object, index: number): ResponseRow => ({
        setId: (('setId' in t) && (typeof t.setId === 'string')) ? t.setId : `auto:${index}`,
        id: (('id' in t) && (typeof t.id === 'string')) ? t.id : `auto:${index}`,
        status: (('status' in t) && (isA<ResponseStatusType>(ResponseStatusList, t.status))) ? t.status : 'VALUE_CHANGED',
        value: (('value' in t) && isResponseValueType(t.value)) ? t.value : '',
        subform: (('subform' in t) && (typeof t.subform === 'string')) ? t.subform : undefined,
        score: (('score' in t) && (typeof t.score === 'number')) ? t.score : undefined,
        code: (('code' in t) && (typeof t.code === 'number')) ? t.code : -Infinity
      }));
  }
}
