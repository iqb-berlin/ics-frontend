import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor() { }
  readonly errors$: BehaviorSubject<string> = new BehaviorSubject<string>('');
}
