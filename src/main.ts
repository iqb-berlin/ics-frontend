import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { MainComponent } from './app/components/main/main.component';

bootstrapApplication(MainComponent, appConfig)
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
