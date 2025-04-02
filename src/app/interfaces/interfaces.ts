import { TaskEventType, TaskType } from '../../../../autocoder-service/src/interfaces/api.interfaces';
import { ChunkTypes, ServiceInfo, TaskTypes } from './api.interfaces';

export interface Service {
  readonly name: string;
  readonly url: string;
}

export type TaskStatus = TaskEventType | 'draft'

export interface TaskOverview {
  readonly id: string;
  readonly label: string;
  readonly type: TaskType;
  readonly status: TaskStatus;
  readonly message: string;
  readonly timestamp: number;
}

export const TabTypes = [...ChunkTypes, ...TaskTypes, 'overview', 'add'] as const;
export type TabType = typeof TabTypes[number];

export interface TaskTab {
  type: TabType;
  id: string;
  label: string;
}

export interface ServiceConnection {
  info: ServiceInfo;
  url: string;
}

