import { SortEventsPipe } from './sort-events.pipe';
import { TaskEvent, TaskEventTypes } from '../interfaces/api.interfaces';

describe('SortEventsPipe', () => {
  it('create an instance', () => {
    const pipe = new SortEventsPipe();
    expect(pipe).toBeTruthy();
  });

  it('should sort', () => {
    const pipe = new SortEventsPipe();
    const list = [
      <TaskEvent>{ timestamp: 50, status: 'create', message: '#1' },
      <TaskEvent>{ timestamp: 70, status: 'fail', message: '#4' },
      <TaskEvent>{ timestamp: 50, status: 'fail', message: '#2' },
      <TaskEvent>{ timestamp: 60, status: 'fail', message: '#3' },
    ];
    const result = pipe.transform(list);
    expect(result.map(e => e.message)).toEqual(['#1', '#2', '#3', '#4']);
  });

  it('should sort backwards', () => {
    const pipe = new SortEventsPipe();
    const list = [
      <TaskEvent>{ timestamp: 50, status: 'create', message: '#1' },
      <TaskEvent>{ timestamp: 70, status: 'fail', message: '#4' },
      <TaskEvent>{ timestamp: 50, status: 'fail', message: '#2' },
      <TaskEvent>{ timestamp: 60, status: 'fail', message: '#3' },
    ];
    const result = pipe.transform(list, 'desc');
    expect(result.map(e => e.message)).toEqual(['#4', '#3', '#2', '#1']);
  });
});
