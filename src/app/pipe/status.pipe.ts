import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../interfaces/interfaces';
import { TaskEvent, TaskEventType, TaskEventTypes, Task } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { isA } from 'iqbspecs-coding-service/functions/common.typeguards';

@Pipe({
  standalone: true,
  name: 'status'
})
export class StatusPipe implements PipeTransform {
  static getLastEvent(task: Task): TaskEvent | undefined {
    return task.events[task.events.length - 1];
  }

  static getStatus(task: Task): TaskStatus {
    const lastEvent = StatusPipe.getLastEvent(task);
    return (lastEvent && isA<TaskEventType>(TaskEventTypes, lastEvent.status)) ? lastEvent.status : 'draft';
  }

  transform(task: Task): TaskStatus {
    return StatusPipe.getStatus(task);
  }
}
