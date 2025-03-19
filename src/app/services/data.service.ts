import { Injectable } from '@angular/core';
import { Service } from '../interfaces/interfaces';
import { ResponseRow, ServiceInfo, Task, TaskType } from '../interfaces/api.interfaces';
import { BackendService } from './backend.service';
import { Services } from '../services';
import { lastValueFrom, map, Observable, tap } from 'rxjs';
import { ErrorService } from './error.service';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly services: { [key: string]: Service } = Services;

  selectedService: string | null = null;

  serviceInfo: ServiceInfo | null = null;

  task: Task | null = null;

  data: ResponseRow[] = [];

  currentChunk: string = '';

  constructor(
    private readonly bs: BackendService
  ) {
    const lastServiceId = localStorage.getItem('csf-service');
    const service = lastServiceId && (lastServiceId in this.services)  ? lastServiceId : null;
    this.selectService(service);
  }

  selectService(serviceId: string | null): Promise<boolean> | boolean {
    this.serviceInfo = null;
    this.selectedService = null;
    if (!serviceId) return false;
    if (!Object.hasOwn(Services, serviceId)) {
      return false;
    }
    const service = this.services[serviceId];
    return lastValueFrom(this.bs.getInfo(service.url)
      .pipe(
         map(info => {
          this.serviceInfo = info;
          this.selectedService = serviceId;
          localStorage.setItem('csf-service', serviceId);
          return true;
        }),
        catchError(err => {
          this.serviceInfo = null;
          this.selectedService = null;
          localStorage.removeItem('csf-service');
          throw err;
        })
      )
    );
  }

  getTask(taskId: string): Observable<Task> {
    return this.bs.getTask(taskId)
      .pipe(
        tap(task => { this.task = task; })
      );
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

  addTask(type: TaskType): Promise<boolean> | boolean {
    return lastValueFrom(
      this.bs.putTask(type)
        .pipe(map(task => {
          this.task = task;
          return true;
        }))
    );
  }

  patchTaskInstructions(instructions: unknown): void {
    if (!this.task) {
      return;
    }
    this.bs.patchTaskInstructions(this.task.id, instructions)
      .subscribe(task => {
        this.task = task;
      });
  }
}
