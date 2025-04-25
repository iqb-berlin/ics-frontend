import { Pipe, PipeTransform } from '@angular/core';
import {Task} from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import {StatusPipe} from './status.pipe';

@Pipe({
  name: 'taskIsReady'
})
export class TaskIsReadyPipe implements PipeTransform {
  transform(task: Task): boolean {
    const status = StatusPipe.getStatus(task);
    if (["commit", "start"].includes(status)) return false;
    if (!task.data.length) return false;
    if ((task.type === 'code') && (!task.coder)) return false;
    if ((task.type === 'train') && (!task.instructions)) return false;
    return true;
  }
}
