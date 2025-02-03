import { Injectable } from '@angular/core';
import { Option, Service } from '../interfaces/interfaces';
import { ServiceInfo } from '../interfaces/api.interfaces';
import { Response } from '@iqb/responses';
import { BackendService } from './backend.service';
import { Services } from '../services';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  services: { [key: string]: Service } = Services;

  selectedService: keyof typeof Services = 'localDefault';

  serviceInfo: ServiceInfo | null = null;

  data: Response[] = [
    { id: 'a', value: 'A', status: 'VALUE_CHANGED' },
    { id: 'b', value: 'B', status: 'VALUE_CHANGED' },
    { id: 'c', value: 'C', status: 'VALUE_CHANGED' },
    { id: 'd', value: 'D', status: 'VALUE_CHANGED' },
  ];

  config: Option[] = [
    { id: 'model', label: 'Model', type: 'select', options: ['default'], value: 'default' },
    { id: 'num_train_epochs', label: 'num_train_epochs', type: 'number', value: 3, range: [1, 5] },
    { id: 'per_device_train_batch_size', label: 'per_device_train_batch_size', type: 'number', value: 2, range: [1, 5] },
  ];

  constructor(
    private readonly bs: BackendService
  ) {

  }

  selectService(service: keyof typeof Services) {
    this.selectedService = service;
    this.bs.getInfo(this.selectedService)
      .subscribe(info => {
        this.serviceInfo = info;
      });
  }
}
