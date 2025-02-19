import { Injectable } from '@angular/core';
import { isTask, ServiceInfo, Task, isServiceInfo, ResponseRow, isResponseRowList, TaskType } from '../interfaces/api.interfaces';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { checkCondition } from '../functions/checkCondition';
import { Router } from '@angular/router';
import { isArrayOf } from '../interfaces/iqb.interfaces';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private url: string = '';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) { }

  getInfo(serviceUrl: string): Observable<ServiceInfo> {
    return this.http.get<ServiceInfo>(serviceUrl + '/info')
      .pipe(
        checkCondition(isServiceInfo),
        tap(serviceInfo => {
          this.url = serviceUrl;
        }),
        catchError(e => {
          this.url = '';
          throw e;
        })
      );
  }

  getTasks(): Observable<Task[]> {
    if (!this.url) {
      this.router.navigate(['']); // TODO move this to routeguard
      return of([]);
    }
    return this.http.get<Task[]>(`${this.url}/tasks`)
      .pipe(checkCondition(response => isArrayOf(response, isTask)))
  }

  getTask(taskId: string): Observable<Task> {
    if (!this.url) throw new Error('not connected'); // TODO move this to routeguard
    return this.http.get<Task>(`${this.url}/tasks/${taskId}`)
      .pipe(checkCondition(isTask));
  }

  getTaskData(taskId: string, chunkId: string): Observable<ResponseRow[]> {
    if (!this.url) throw new Error('not connected'); // TODO move this to routeguard
    return this.http.get<ResponseRow[]>(`${this.url}/tasks/${taskId}/data/${chunkId}`)
      .pipe(checkCondition(isResponseRowList));
  }

  patchTask(taskId: string): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/tasks/${taskId}`, { action: 'commit' })
      .pipe(checkCondition(isTask));
  }

  putTask(type: TaskType, instructions: object): Observable<Task> {
    return this.http.put<Task>(`${this.url}/tasks`, { type, instructions })
      .pipe(checkCondition(isTask));
  }
}
