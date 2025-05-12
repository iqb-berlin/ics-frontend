/* eslint-disable implicit-arrow-linebreak */
import { TaskEvent, TaskEventTypes } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';

export const compareEvents = (direction: 'asc' | 'desc' = 'asc'): ((e1: TaskEvent, e2:TaskEvent) => -1 | 1) => {
  const r: [(1 | -1), (1 | -1)] = direction === 'asc' ? [1, -1] : [-1, 1];
  return (event1: TaskEvent, event2:TaskEvent): 1 | -1 => {
    if (event1.timestamp > event2.timestamp) return r[0];
    if (event1.timestamp < event2.timestamp) return r[1];
    return TaskEventTypes.indexOf(event1.status) > TaskEventTypes.indexOf(event2.status) ? r[0] : r[1];
  };
};

export const sortEvents = (direction: 'asc' | 'desc' = 'asc'): ((events: TaskEvent[]) => TaskEvent[]) =>
  events => events.sort(compareEvents(direction));
