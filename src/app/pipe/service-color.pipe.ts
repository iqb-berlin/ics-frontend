import { Pipe, PipeTransform } from '@angular/core';
import { ServiceInfo } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';

@Pipe({
  name: 'serviceColor'
})
export class ServiceColorPipe implements PipeTransform {

  // eslint-disable-next-line class-methods-use-this
  transform(serviceId: string | undefined): unknown {
    if (!serviceId) return 'black';
    const hsl = (h: number, s: number, l: number) => `hsl(${h}, ${s}%, ${l}%)`;
    const h = (
      serviceId.length *
      serviceId.charCodeAt(0) *
      serviceId.charCodeAt(serviceId.length / 4) *
      serviceId.charCodeAt(serviceId.length / 4) *
      serviceId.charCodeAt(serviceId.length / 2) *
      serviceId.charCodeAt(3 * (serviceId.length / 4)) *
      serviceId.charCodeAt(serviceId.length - 1)
    ) % 360;
    return hsl(h, 100, 25);
  }
}
