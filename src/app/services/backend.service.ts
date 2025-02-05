import { Injectable } from '@angular/core';
import { isArrayOf, isTask, ServiceInfo, Task, isServiceInfo } from '../interfaces/api.interfaces';
import { Response } from '@iqb/responses';
import { HttpClient } from '@angular/common/http';
import { Services } from '../services';
import { catchError, Observable, of, tap } from 'rxjs';
import { checkCondition } from '../functions/checkCondition';
import { Router } from '@angular/router';
import { isResponseList } from '../interfaces/iqb.interfaces';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private url: string = '';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) { }

  getInfo(service: keyof typeof Services): Observable<ServiceInfo> {
    return this.http.get<ServiceInfo>(Services[service].url + '/info')
      .pipe(
        checkCondition(isServiceInfo),
        tap(serviceInfo => {
          this.url = Services[service].url;
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
      .pipe(checkCondition(response => isArrayOf<Task>(response, isTask)))
  }

  getTask(taskId: string): Observable<Task> {
    if (!this.url) throw new Error('not connected'); // TODO move this to routeguard
    return this.http.get<Task>(`${this.url}/tasks/${taskId}`)
      .pipe(checkCondition(isTask));
  }

  getTaskData(taskId: string, chunkId: string): Observable<Response[]> {
    if (!this.url) throw new Error('not connected'); // TODO move this to routeguard
    return this.http.get<Response[]>(`${this.url}/tasks/${taskId}/data/${chunkId}`)
      .pipe(checkCondition(isResponseList));
  }

  patchTask(taskId: string): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/tasks/${taskId}`, { action: 'commit' })
      .pipe(checkCondition(isTask));
  }
}
