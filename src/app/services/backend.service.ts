import { Injectable } from '@angular/core';
import { ServiceInfo } from '../interfaces/api.interfaces';
import { HttpClient } from '@angular/common/http';
import { Services } from '../services';
import { Observable } from 'rxjs';
import { isServiceInfo } from '../../../../autocoder-service/src/interfaces/api.interfaces';
import { checkCondition } from '../functions/checkCondition';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private readonly http: HttpClient
  ) { }

  getInfo(service: keyof typeof Services): Observable<ServiceInfo> {
    return this.http.get<ServiceInfo>(Services[service].url + '/info')
      .pipe(checkCondition(isServiceInfo));
  }
}
