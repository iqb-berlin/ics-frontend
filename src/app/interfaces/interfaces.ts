import {
  TaskEventType, TaskType, ChunkTypes, TaskTypes, ServiceInfo
} from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';

export interface IcsfConfig {
  readonly services: string[];
  readonly userlink?: string;
  readonly withCredentials?: boolean;
}

export type TaskStatus = TaskEventType | 'draft';

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
  info?: ServiceInfo;
  url: string;
  status: 'ok' | 'error' | 'connecting' | 'version-error';
}
