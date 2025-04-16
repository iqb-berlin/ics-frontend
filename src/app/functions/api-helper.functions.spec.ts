import { sortEvents } from './api-helper.functions';
import { TaskEvent } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';

describe('Api Helper', () => {

  describe('sortEvent', () => {

    it('should sort', () => {
      const list = [
        <TaskEvent>{ timestamp: 50, status: 'create', message: '#1' },
        <TaskEvent>{ timestamp: 70, status: 'fail', message: '#4' },
        <TaskEvent>{ timestamp: 50, status: 'fail', message: '#2' },
        <TaskEvent>{ timestamp: 60, status: 'fail', message: '#3' },
      ];
      const result = sortEvents('asc')(list);
      expect(result.map(e => e.message)).toEqual(['#1', '#2', '#3', '#4']);
    });

    it('should sort backwards', () => {
      const list = [
        <TaskEvent>{ timestamp: 50, status: 'create', message: '#1' },
        <TaskEvent>{ timestamp: 70, status: 'fail', message: '#4' },
        <TaskEvent>{ timestamp: 50, status: 'fail', message: '#2' },
        <TaskEvent>{ timestamp: 60, status: 'fail', message: '#3' },
      ];
      const result = sortEvents('desc')(list);
      expect(result.map(e => e.message)).toEqual(['#4', '#3', '#2', '#1']);
    });
  });
});
