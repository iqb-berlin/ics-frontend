import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { checkCondition } from '../functions/check-condition';
import { ServiceConnection } from '../interfaces/interfaces';
import {
  Coder,
  DataChunk,
  ResponseRow,
  ServiceInfo,
  Task,
  TaskAction,
  TaskUpdate
} from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import {
  isCoder,
  isDataChunk,
  isResponseRowList,
  isServiceInfo,
  isTask
} from 'iqbspecs-coding-service/functions/ics-api.typeguards';
import { isArrayOf } from 'iqbspecs-coding-service/functions/common.typeguards';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private _url: string | null = null;

  get url(): string {
    if (!this._url) throw new Error("No service connected!");
    return this._url;
  }

  set url(url: string) {
    this._url = url;
  }

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  getConnection(url: string): Observable<ServiceConnection> {
    return this.http.get<ServiceConnection>(url + '/info')
      .pipe(
        checkCondition(isServiceInfo),
        map((info: ServiceInfo): ServiceConnection => ({ url, status: 'ok', info })),
        catchError((e): Observable<ServiceConnection> => of({ url, status: 'error' })),
        startWith(<ServiceConnection>{ url, status: 'connecting' })
      );
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/tasks`)
      .pipe(checkCondition(response => isArrayOf(response, isTask)))
  }

  getTask(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.url}/tasks/${taskId}`)
      .pipe(checkCondition(isTask));
  }

  getTaskData(taskId: string, chunkId: string): Observable<ResponseRow[]> {
    return this.http.get<ResponseRow[]>(`${this.url}/tasks/${taskId}/data/${chunkId}`)
      .pipe(checkCondition(isResponseRowList));
  }

  putTaskData(taskId: string, fileContent: ResponseRow[]): Observable<DataChunk> {
    return this.http.put<DataChunk>(`${this.url}/tasks/${taskId}/data/`, fileContent)
      .pipe(checkCondition(isDataChunk));
  }

  postTask(taskId: string, action: TaskAction): Observable<Task> {
    return this.http.post<Task>(`${this.url}/tasks/${taskId}/${action}`, {})
      .pipe(checkCondition(isTask));
  }

  putTask(seed: TaskUpdate): Observable<Task> {
    return this.http.put<Task>(`${this.url}/tasks`, seed)
      .pipe(checkCondition(isTask));
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/tasks/${taskId}`);
  }

  patchTask(taskId: string, update: TaskUpdate): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/tasks/${taskId}`, update)
      .pipe(checkCondition(isTask));
  }

  getCoders(): Observable<Coder[]> {
    return this.http.get<Task>(`${this.url}/coders/`)
      .pipe(checkCondition(r => isArrayOf<Coder>(r, isCoder)));
  }

  deleteCoder(coderId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/coders/${coderId}`);
  }

  deleteDataChunk(taskId: string, chunkId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/tasks/${taskId}/data/${chunkId}`);
  }
}
