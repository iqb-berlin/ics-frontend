import { TaskEventType, TaskType } from '../../../../autocoder-service/src/interfaces/api.interfaces';
import { ChunkType, ServiceInfo } from './api.interfaces';

export interface Service {
  readonly name: string;
  readonly url: string;
}

export type TaskStatus = TaskEventType | 'draft'

export interface TaskOverview {
  readonly id: string;
  readonly type: TaskType;
  readonly status: TaskStatus;
  readonly message: string;
  readonly timestamp: number;
}

export interface TaskTab {
  type: ChunkType | 'config' | 'overview';
  id: string;
  label: string;
}

export interface ServiceConnection {
  info: ServiceInfo;
  url: string;
}
