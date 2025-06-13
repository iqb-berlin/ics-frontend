import { Pipe, PipeTransform } from '@angular/core';
import { ServiceMode, Task } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { StatusPipe } from './status.pipe';

@Pipe({
  standalone: true,
  name: 'taskIsReady'
})
export class TaskIsReadyPipe implements PipeTransform {
  // eslint-disable-next-line class-methods-use-this
  transform(task: Task, serviceMode: ServiceMode | undefined = undefined): boolean {
    // eslint-disable-next-line no-param-reassign
    serviceMode = serviceMode || 'train+code';
    const status = StatusPipe.getStatus(task);
    if (['commit', 'start'].includes(status)) return false;
    if (task.type === 'unknown') return false;
    if (serviceMode === 'train+code') {
      if ((task.type === 'code') && (!task.data.length)) return false;
      if ((task.type === 'code') && (!task.coder)) return false;
      if ((task.type === 'train') && (!task.instructions)) return false;
    } else if (serviceMode === 'direct') {
      if (task.type === 'train') return false;
      if (!task.data.length) return false;
      if (!task.instructions) return false;
    }
    return true;
  }
}
