import { Injectable } from '@angular/core';
import {
  Coder, DataChunk,
  ResponseRow,
  ServiceInfo,
  Task, TaskUpdate
} from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import {
  BehaviorSubject, combineLatest, lastValueFrom, map, Observable, tap
} from 'rxjs';
import { ServiceConnection, TaskStatus } from '../interfaces/interfaces';
import { BackendService } from './backend.service';
import { compareEvents } from '../functions/api-helper.functions';
import { StatusPipe } from '../pipe/status.pipe';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  serviceInfo: ServiceInfo | null = null;
  private readonly _services$: BehaviorSubject<ServiceConnection[]> = new BehaviorSubject<ServiceConnection[]>([]);
  private readonly _serviceConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get serviceConnected$(): Observable<boolean> {
    return this._serviceConnected$.asObservable();
  }

  private readonly _data: BehaviorSubject<ResponseRow[]> = new BehaviorSubject<ResponseRow[]>([]);
  coders: Coder[] = [];
  currentChunk: DataChunk | null = null;

  private _task: Task | null = null;
  private _taskStatus: TaskStatus | null = null;

  set task(task: Task | null) {
    this._task = task;
    this.currentChunk = null;
    if (!this._task) return;
    this._task.events.sort(compareEvents('asc'));
    this._taskStatus = StatusPipe.getStatus(this._task);
  }

  get task(): Task | null {
    return this._task;
  }

  get status(): TaskStatus | null {
    return this._taskStatus;
  }

  get data(): ResponseRow[] {
    return this._data.getValue();
  }

  get data$(): Observable<ResponseRow[]> {
    return this._data.asObservable();
  }

  get services$(): Observable<ServiceConnection[]> {
    return this._services$;
  }

  constructor(
    private readonly bs: BackendService,
    private readonly cs: ConfigService
  ) {
    this.cs.loadConfig()
      .then(config => {
        combineLatest(config.services.map(url => this.bs.getConnection(url)))
          .subscribe(this._services$)
          .add(() => {
            const lastServiceId = localStorage.getItem('csf-service');
            const service = lastServiceId || null;
            this.selectService(service);
          });
      });
  }

  selectService(serviceId: string | null): boolean {
    this.serviceInfo = null;
    const services = this._services$.getValue();
    const service = services.find(serviceConnection => serviceConnection.info?.id === serviceId);
    if (!service) return false;
    if ((service.status === 'error') || (!service.info)) {
      this._serviceConnected$.next(false);
      throw new Error(`No ICS service under ${service.url} available!`);
    }
    this.serviceInfo = service.info;
    this.bs.url = service.url;
    this._serviceConnected$.next(true);
    localStorage.setItem('csf-service', this.serviceInfo.id);
    return true;
  }

  getTask(taskId: string): Observable<Task> {
    return this.bs.getTask(taskId)
      .pipe(
        tap(task => { this.task = task; })
      );
  }

  getTaskData(chunkId: string | null): void {
    if (!chunkId) {
      this.currentChunk = null;
      this._data.next([]);
      return;
    }
    if (!this.task) return;
    this.currentChunk = this.task.data.find(chunk => chunk.id === chunkId) || null;
    if (!this.currentChunk) throw new Error(`invalid chunk id: ${chunkId}`);
    console.log('ok', this.currentChunk.id);
    this.bs.getTaskData(this.task.id, this.currentChunk.id)
      .subscribe(this._data);
  }

  async commitTask(): Promise<void> {
    if (!this.task) return Promise.resolve();
    return lastValueFrom(this.bs.postTask(this.task.id, 'commit')
      .pipe(map(task => {
        this.task = task;
      })));
  }

  async addTask(seed: TaskUpdate): Promise<void> {
    this.task = await lastValueFrom(this.bs.putTask(seed));
  }

  async deleteTask(id: string | undefined = this.task?.id): Promise<void> {
    if (!id) return Promise.resolve();
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

  async deleteChunk(chunkId: string): Promise<void> {
    if (!this.task) return;
    if (!this.task.data.find(chunk => chunk.id === chunkId)) throw new Error('invalid chunk id');
    await lastValueFrom(this.bs.deleteDataChunk(this.task.id, chunkId));
  }
}
