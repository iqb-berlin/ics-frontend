import { Injectable } from '@angular/core';
import { Service } from '../interfaces/interfaces';
import { ResponseRow, ServiceInfo, Task, TaskType } from '../interfaces/api.interfaces';
import { BackendService } from './backend.service';
import { Services } from '../services';
import { BehaviorSubject, catchError, lastValueFrom, map, Observable, Subscription, switchMap, tap } from 'rxjs';
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
    private readonly bs: BackendService
  ) {
    this.selectService(Object.keys(Services).pop() || null);
  }

  selectService(serviceId: string | null): Promise<boolean> | boolean {
    console.log('SelectService', serviceId);
    this.serviceInfo = null;
    this.selectedService = null;
    if (!serviceId) return false;
    if (!Object.hasOwn(Services, serviceId)) {
      this.errors$.next('unknown service: ' + serviceId);
      return false;
    }
    const service = this.services[serviceId];
    try {
      return lastValueFrom(this.bs.getInfo(service.url)
        .pipe(
           map(info => {
            this.serviceInfo = info;
            this.selectedService = serviceId;
            return true;
          })
        )
      );
    } catch (error) {
      this.errors$.next('Error');
      console.error(error);
      return false;
    }
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
    try {
      return lastValueFrom(
        this.bs.putTask(type, {})
          .pipe(map(task => {
            this.task = task;
            return true;
          }))
      );
    } catch (error) {
      this.errors$.next('Error');
      console.error(error);
      return false;
    }
  }
}
