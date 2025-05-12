import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  readonly errors$: BehaviorSubject<string> = new BehaviorSubject<string>('');
}
