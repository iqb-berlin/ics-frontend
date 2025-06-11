import { Injectable } from '@angular/core';
import {BehaviorSubject, filter, lastValueFrom, Observable, tap} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as icsPackage from 'iqbspecs-coding-service/package.json';
import * as frontendPackage from '../../../package.json';
import { checkCondition } from '../functions/check-condition';
import { IcsfConfig } from '../interfaces/interfaces';
import { isIcsfConfig } from '../functions/type-guards';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _config$: BehaviorSubject<IcsfConfig | null> = new BehaviorSubject<IcsfConfig | null>(null);
  readonly icsVersion: string;
  readonly version: string;
  constructor(
    private readonly http: HttpClient
  ) {
    this.icsVersion = icsPackage.version;
    this.version = frontendPackage.version;
  }

  get config$(): Observable<IcsfConfig> {
    return this._config$.asObservable()
      .pipe(filter(entry => entry !== null));
  }

  async loadConfig(): Promise<IcsfConfig> {
    return lastValueFrom(
      this.http.get<IcsfConfig>('/config/config.json')
        .pipe(
          checkCondition(isIcsfConfig),
          tap(config => {
            this._config$.next(config);
          })
        )
    );
  }
}
