import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { StatusPipe } from './status.pipe';

@Pipe({
  standalone: true,
  name: 'taskProgress'
})
export class TaskProgressPipe implements PipeTransform {
  // eslint-disable-next-line class-methods-use-this
  transform(task: Task): number | 'error' | 'unknown' {
    const lastEvent = StatusPipe.getLastEvent(task, ['warning']);
    switch (lastEvent?.status) {
      case undefined:
      case 'create':
      case 'start':
      case 'commit':
        return 0;
      case 'finish':
        return 100;
      case 'fail':
      case 'abort':
        return 'error';
      case 'progress':
        if (/^\d+\/\d+$/.test(lastEvent.message)) {
          const p = lastEvent.message.split('/', 2).map(d => Number(d));
          return 100 * (p[0] / p[1]);
        }
        return 'unknown';
      default:
        return 'unknown';
    }
  }
}
