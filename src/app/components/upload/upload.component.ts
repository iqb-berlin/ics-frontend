import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { isResponseList } from '../../interfaces/iqb.interfaces';
import { isResponseRowList, ResponseRow, Task } from '../../interfaces/api.interfaces';
import { BackendService } from '../../services/backend.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-upload',
  imports: [
    MatButton
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  @ViewChild('fileInput') private fileInput: ElementRef | undefined;

  constructor(
    private bs: BackendService,
    private ds: DataService,
  ) {
  }

  openFileDialog(): void {
    console.log(this.fileInput);
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
      console.log($event);
      throw new Error('Upload error (0)');
    }
    const file: File = $event.target.files[0];

    const reader = new FileReader();
    reader.onload = e => this.onFileLoad(e);
    reader.readAsArrayBuffer(file);
  }

  onFileLoad($event: ProgressEvent<FileReader>) {
    if (!this.ds.task) throw new Error('No task found.');
    if (
      !('target' in $event) ||
      ($event.target == null) ||
      !('result' in $event.target) ||
      !($event.target.result instanceof ArrayBuffer)
    ) {
      throw new Error('Upload error (1)');
    }

    const text = new TextDecoder().decode($event.target.result);
    const fileContent = this.parseFile(text);
    this.bs.putTaskData(this.ds.task.id, fileContent).subscribe();
  }

  parseFile(content: string): ResponseRow[] {
    const contentJson: unknown = JSON.parse(content);
    if (isResponseList(contentJson)) {
      return contentJson.map(row => ({...row, setId: 'auto'}));
    }
    if (isResponseRowList(contentJson)) {
      return contentJson;
    }
    throw new Error('File does not contain responses');
  }
}
