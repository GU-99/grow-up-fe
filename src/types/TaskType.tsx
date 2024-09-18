import type { Assignee } from '@/types/AssigneeType';
import type { ProjectStatus } from '@/types/ProjectStatusType';

type RenameKeys<T, R extends { [K in keyof R]: K extends keyof T ? string : never }> = {
  [P in keyof T as P extends keyof R ? R[P] : P]: T[P];
};

type StatusKeyMapping = {
  sortOrder: 'statusOrder';
};

export type Task = {
  taskId: number;
  statusId: number;
  name: string;
  content: string;
  startDate: string;
  endDate: string;
  files: string[];
  sortOrder: number;
};

export type TaskOrder = Pick<Task, 'statusId' | 'taskId' | 'sortOrder'>;
export type TaskOrderForm = { tasks: TaskOrder[] };

export type TaskForm = Omit<Task, 'taskId' | 'files'> & { assignees: Assignee['userId'][] };

export type TaskWithStatus = RenameKeys<Omit<ProjectStatus, 'projectId'>, StatusKeyMapping> & Task;
export type TaskListWithStatus = Omit<ProjectStatus, 'projectId'> & { tasks: Task[] };
