import { TaskIsReadyPipe } from './task-is-ready.pipe';

describe('TaskIsReadyPipe', () => {
  it('create an instance', () => {
    const pipe = new TaskIsReadyPipe();
    expect(pipe).toBeTruthy();
  });
});
