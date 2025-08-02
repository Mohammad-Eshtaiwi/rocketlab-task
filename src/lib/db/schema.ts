export const DB_CONFIG = {
  name: 'TaskDatabase',
  version: 1,
  stores: {
    tasks: '++id, title, status, priority, createdAt, completedAt'
  }
} as const;

export const TASK_INDEXES = {
  byStatus: 'status',
  byPriority: 'priority',
  byCreatedAt: 'createdAt',
  byCompletedAt: 'completedAt'
} as const;