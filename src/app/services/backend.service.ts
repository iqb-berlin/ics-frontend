import { Injectable } from '@angular/core';
import { isArrayOf, isTask, ServiceInfo, Task } from '../interfaces/api.interfaces';
import { HttpClient } from '@angular/common/http';
import { Services } from '../services';
import { catchError, Observable, of, tap } from 'rxjs';
import { isServiceInfo } from '../../../../autocoder-service/src/interfaces/api.interfaces';
import { checkCondition } from '../functions/checkCondition';
import { Router } from '@angular/router';

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
          console.log('!', this.url)
        }),
        catchError(e => {
          this.url = '';
          throw e;
        })
      );
  }

  getTasks(): Observable<Task[]> {
    console.log('##', this.url)
    if (!this.url) {
      this.router.navigate(['']); // TODO move this to routeguard
      return of([]);
    }
    return this.http.get<Task[]>(`${this.url}/tasks`)
      .pipe(checkCondition(response => isArrayOf<Task>(response, isTask)))
  }
}
