import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskEvent, TaskEventType, TaskEventTypes } from '../interfaces/api.interfaces';
import { isA } from '../interfaces/iqb.interfaces';
import { TaskStatus } from '../interfaces/interfaces';
import { SortEventsPipe } from './sort-events.pipe';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {
  static getLastEvent(task: Task): TaskEvent | undefined {
    return task.events.sort(SortEventsPipe.compareEvents('desc'))[0];
  }

  static getStatus(task: Task): TaskStatus {
    const lastEvent = StatusPipe.getLastEvent(task);
    return (lastEvent && isA<TaskEventType>(TaskEventTypes, lastEvent.status)) ? lastEvent.status : 'draft';
  }

  transform(task: Task): TaskStatus {
    return StatusPipe.getStatus(task);
  }
}
