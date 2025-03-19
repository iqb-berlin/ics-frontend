import { inject } from '@angular/core';
import {
  HttpErrorResponse, HttpInterceptorFn
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorService } from './services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const es = inject(ErrorService);
  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse) {
        es.errors$.next(error.error.message);
      }
      throw error;
    })
  );
};
