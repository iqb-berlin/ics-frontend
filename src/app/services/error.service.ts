import { ErrorHandler, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {
  readonly errors$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-explicit-any
  handleError(error: any): void {
    if (error instanceof Error) {
      this.errors$.next(error.message);
    }
    throw error;
  }
}
