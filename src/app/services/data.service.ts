import { Injectable } from '@angular/core';
import { Service } from '../interfaces/interfaces';
import { BackendService } from './backend.service';
import { Services } from '../services';
import { lastValueFrom, map, Observable, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { compareEvents } from '../functions/api-helper.functions';
import {
  Coder,
  ResponseRow,
  ServiceInfo,
  Task, TaskUpdate,
} from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { isA } from 'iqbspecs-coding-service/functions/common.typeguards';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly services: { [key: string]: Service } = Services;
  selectedService: keyof typeof Services | null | undefined = null; // undefined as starting value breaks the binding
  serviceInfo: ServiceInfo | null = null;
  data: ResponseRow[] = [];
  coders: Coder[] = [];

  private _task: Task | null = null;

  set task(task: Task | null) {
    this._task = task;
    this._task?.events.sort(compareEvents('asc'));
  }

  get task(): Task | null {
    return this._task;
  }

  constructor(
    private readonly bs: BackendService
  ) {
    this.serviceInfo = null;
    const lastServiceId = localStorage.getItem('csf-service');
    const service = lastServiceId && (lastServiceId in this.services)  ? lastServiceId : null;
    this.selectService(service);
  }

  selectService(serviceId: string | null): Promise<boolean> | boolean {
    this.serviceInfo = null; // important
    this.selectedService = null;
    if (!serviceId) return false;
    if (!Object.hasOwn(Services, serviceId)) {
      return false;
    }
    const service = this.services[serviceId];
    return lastValueFrom(this.bs.getInfo(service.url)
      .pipe(
         map(info => {
          if (!isA<keyof typeof Services>(Object.keys(Services), serviceId)) throw new Error('Unknown ServiceId');
          this.serviceInfo = info;
          this.selectedService = serviceId;
          localStorage.setItem('csf-service', serviceId);
          return true;
        }),
        catchError(err => {
          this.serviceInfo = null;
          this.selectedService = undefined;
          localStorage.removeItem('csf-service');
          return of(false);
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
      });
  }

  async commitTask(): Promise<void> {
    if (!this.task) return;
    return lastValueFrom(this.bs.postTask(this.task.id, 'commit')
      .pipe(map(task => {
        this.task = task;
      })));
  }

  async addTask(seed: TaskUpdate): Promise<void> {
    this.task = await lastValueFrom(this.bs.putTask(seed));
  }

  async deleteTask(id: string | undefined = this.task?.id): Promise<void> {
    if (!id) return;
    return lastValueFrom(this.bs.deleteTask(id));
  }

  async updateTask(update: TaskUpdate): Promise<void> {
    if (!this.task) return;
    this.task = await lastValueFrom(this.bs.patchTask(this.task.id, update));
  }

  async updateCoders(): Promise<void> {
    this.coders = await lastValueFrom(this.bs.getCoders());
  }

  async deleteCoder(coderId: string): Promise<void> {
    await lastValueFrom(this.bs.deleteCoder(coderId));
  }
}
