import { Injectable } from '@angular/core';
import { Service } from '../interfaces/interfaces';
import { isJsonSchema, ServiceInfo, Task } from '../interfaces/api.interfaces';
import { Response } from '@iqb/responses';
import { BackendService } from './backend.service';
import { Services } from '../services';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly services: { [key: string]: Service } = Services;

  selectedService: keyof typeof Services | null = null;

  serviceInfo: ServiceInfo | null = null;

  data: Response[] = [
    { id: 'a', value: 'A', status: 'VALUE_CHANGED' },
    { id: 'b', value: 'B', status: 'VALUE_CHANGED' },
    { id: 'c', value: 'C', status: 'VALUE_CHANGED' },
    { id: 'd', value: 'D', status: 'VALUE_CHANGED' },
  ];

  readonly errors$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private readonly bs: BackendService,
    private router: Router
  ) {
    this.selectService('localDefault');
  }

  selectService(service: keyof typeof Services) {
    this.serviceInfo = null;
    this.selectedService = null;
    this.bs.getInfo(service)
      .subscribe(info => {
        this.serviceInfo = info;
        this.selectedService = service;
        this.router.navigate(['tasks']);
      }, err => {
        this.errors$.next('Error');
        console.error(err);
      })
  }
}
