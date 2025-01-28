import { Injectable } from '@angular/core';
import { Option, Service } from '../interfaces/interfaces';
import { IQBVariable } from '../interfaces/iqb.interfaces';
import { DefaultService, ServiceInfo, TaskAction } from '../../gen';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public services: { [key: string]: Service } = {
    localDefault: {
      name: "Standard",
      url: "http://localhost/"
    }
  };

  selectedService = 'localDefault';

  serviceInfo: ServiceInfo = {};

  data: IQBVariable[] = [
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
    private ds: DefaultService
  ) {
    this.ds.infoGet()
      .subscribe(info => {
        this.serviceInfo = info;
      });
  }
}
