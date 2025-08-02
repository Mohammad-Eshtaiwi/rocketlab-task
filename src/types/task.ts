import type { Priority } from './priority';
import type { Status } from './statuses';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  createdAt: Date;
  completedAt?: Date;
  updatedAt?: Date;
}

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
}

export interface TaskStats {
  total: number;
  active: number;
  completed: number;
}