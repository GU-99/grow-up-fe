import type { User } from '@/types/UserType';
import type { ProjectStatus } from '@/types/ProjectStatusType';

type RenameKeys<T, R extends { [K in keyof R]: K extends keyof T ? string : never }> = {
  [P in keyof T as P extends keyof R ? R[P] : P]: T[P];
};

type StatusKeyMapping = {
  sortOrder: 'statusSortOrder';
};

export type Task = {
  taskId: number;
  statusId: number;
  taskName: string;
  content: string;
  startDate: string;
  endDate: string;
  sortOrder: number;
};

export type TaskOrder = Pick<Task, 'statusId' | 'taskId' | 'sortOrder'>;
export type TaskOrderForm = { tasks: TaskOrder[] };

export type TaskInfoForm = Omit<Task, 'taskId'>;
export type TaskFilesForm = { files: File[] };
export type TaskAssigneeForm = { userId: User['userId'] };
export type TaskAssigneesForm = { assignees: User['userId'][] };
export type TaskUpdateForm = Omit<Task, 'statusId'> & { statusId: string };
export type TaskCreationForm = TaskInfoForm & TaskAssigneesForm;
export type TaskForm = TaskCreationForm & TaskFilesForm;
export type TaskUploadForm = Pick<Task, 'taskId'> & { file: File };

export type TaskWithStatus = RenameKeys<Omit<ProjectStatus, 'projectId'>, StatusKeyMapping> & Task;
export type TaskListWithStatus = Omit<ProjectStatus, 'projectId'> & { tasks: Task[] };
