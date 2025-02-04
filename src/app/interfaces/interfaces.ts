import { TaskEventType, TaskType } from '../../../../autocoder-service/src/interfaces/api.interfaces';

export interface Service {
  readonly name: string;
  readonly url: string;
}

export interface TaskOverview {
  readonly id: string;
  readonly type: TaskType;
  readonly status: TaskEventType | 'draft';
  readonly message: string;
  readonly timestamp: number;
}
