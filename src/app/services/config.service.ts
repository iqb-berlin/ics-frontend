import { Injectable } from '@angular/core';
import { lastValueFrom, tap } from 'rxjs';
import { checkCondition } from '../functions/check-condition';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../interfaces/interfaces';
import { isAppConfig } from '../functions/type-guards';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _config: AppConfig | null = null;
  constructor(
    private readonly http: HttpClient,
  ) {
  }

  get config(): AppConfig {
    if (!this._config) throw new Error('No config provided');
    return this._config;
  }

  async loadConfig(): Promise<AppConfig> {
    return lastValueFrom(
      this.http.get<AppConfig>('/config/config.json')
        .pipe(
          checkCondition(isAppConfig),
          tap(config => {
            this._config = config;
          })
        )
    );
  }
}
