import { Injectable } from '@angular/core';
import { Service } from '../interfaces/interfaces';
import { ResponseRow, ServiceInfo, Task } from '../interfaces/api.interfaces';
import { BackendService } from './backend.service';
import { Services } from '../services';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly services: { [key: string]: Service } = Services;

  selectedService: keyof typeof Services | null = null;

  serviceInfo: ServiceInfo | null = null;

  task: Task | null = null;

  data: ResponseRow[] = [];

  readonly errors$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  currentChunk: string = '';

  constructor(
    private readonly bs: BackendService,
    private router: Router
  ) {
    this.selectService('localDefault');
  }

  selectService(service: keyof typeof Services) {
    this.serviceInfo = null;
    this.selectedService = null;
    this.bs.getInfo(service)
      .subscribe(info => {
        this.serviceInfo = info;
        this.selectedService = service;
        this.router.navigate(['tasks']);
      }, err => {
        this.errors$.next('Error');
        console.error(err);
      })
  }

  getTask(taskId: string): void {
    this.bs.getTask(taskId)
      .subscribe(task => {
        this.task = task;
        const firstInputChunk = task.data.find(d => d.type === 'input');
        if (!firstInputChunk) {
          // TODO create new input chunk
        } else {
          this.getTaskData(firstInputChunk.id);
        }
      });
  }

  getTaskData(chunkId: string): void {
    if (!this.task) return;
    this.bs.getTaskData(this.task.id, chunkId)
      .subscribe(data => {
        this.data = data;
        this.currentChunk = chunkId;
      });
  }

  startEncoding() {
    if (!this.task) return;
    this.bs.patchTask(this.task.id)
      .subscribe(task => {
        this.task = task;
      });
  }
}
