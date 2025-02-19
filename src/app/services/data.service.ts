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

  selectedService: string | null = null;

  serviceInfo: ServiceInfo | null = null;

  task: Task | null = null;

  data: ResponseRow[] = [];

  readonly errors$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  currentChunk: string = '';

  constructor(
    private readonly bs: BackendService,
    private router: Router
  ) {
    this.selectService(Object.keys(Services).pop() || null);
  }

  selectService(serviceId: string | null): void {
    console.log('SelectService', serviceId);
    this.serviceInfo = null;
    this.selectedService = null;
    if (!serviceId) return;
    if (!Object.hasOwn(Services, serviceId)) {
      this.errors$.next('unknown service: ' + serviceId);
      return;
    }
    const service = this.services[serviceId];
    this.bs.getInfo(service.url)
      .subscribe({
        next: info => {
          this.serviceInfo = info;
          this.selectedService = serviceId;
          this.router.navigate(['tasks']);
        },
        error: err => {
          this.errors$.next('Error');
          console.error(err);
        }
      });
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
