import { ProjectStatus } from '@/types/ProjectStatusType';

type RenameKeys<T, R extends { [K in keyof R]: K extends keyof T ? string : never }> = {
  [P in keyof T as P extends keyof R ? R[P] : P]: T[P];
};

type StatusKeyMapping = {
  sortOrder: 'statusOrder';
};

export type Task = {
  taskId: number;
  userId: number[];
  statusId: number;
  name: string;
  content: string;
  startDate: string;
  endDate: string;
  files: string[];
  sortOrder: number;
};

export type TaskForm = Omit<Task, 'taskId' | 'files'>;

export type TaskWithStatus = RenameKeys<Omit<ProjectStatus, 'projectId'>, StatusKeyMapping> & Task;

export type TaskListWithStatus = Omit<ProjectStatus, 'projectId'> & { tasks: Task[] };
