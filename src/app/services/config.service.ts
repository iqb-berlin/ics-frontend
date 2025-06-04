import { Injectable } from '@angular/core';
import { lastValueFrom, tap } from 'rxjs';
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
  private _config: IcsfConfig | null = null;
  readonly icsVersion: string;
  readonly version: string;
  constructor(
    private readonly http: HttpClient
  ) {
    this.icsVersion = icsPackage.version;
    this.version = frontendPackage.version;
  }

  get config(): IcsfConfig {
    if (!this._config) throw new Error('No config provided');
    return this._config;
  }

  async loadConfig(): Promise<IcsfConfig> {
    return lastValueFrom(
      this.http.get<IcsfConfig>('/config/config.json')
        .pipe(
          checkCondition(isIcsfConfig),
          tap(config => {
            this._config = config;
          })
        )
    );
  }
}
