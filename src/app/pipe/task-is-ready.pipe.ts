import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { StatusPipe } from './status.pipe';

@Pipe({
  standalone: true,
  name: 'taskIsReady'
})
export class TaskIsReadyPipe implements PipeTransform {
  // eslint-disable-next-line class-methods-use-this
  transform(task: Task): boolean {
    const status = StatusPipe.getStatus(task);
    if (['commit', 'start'].includes(status)) return false;
    if ((task.type === 'code') && (!task.data.length)) return false;
    if (task.type === 'unknown') return false;
    if ((task.type === 'code') && (!task.coder)) return false;
    if ((task.type === 'train') && (!task.instructions)) return false;
    return true;
  }
}
