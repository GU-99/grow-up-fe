import { ProjectStatus } from '@/types/ProjectStatusType';

type RenameKeys<T, R extends { [K in keyof R]: K extends keyof T ? string : never }> = {
  [P in keyof T as P extends keyof R ? R[P] : P]: T[P];
};

type StatusKeyMapping = {
  name: 'statusName';
  order: 'statusOrder';
};

// ToDo: API 설계 완료시 데이터 타입 변경할 것
export type Task = {
  taskId: number;
  name: string;
  order: number;
  userId: number;
  files: string[];
  startDate: string;
  endDate: string;
};

// ToDo: Task 추가 모달 작업시 같이 정의할 것
export type TaskForm = {
  name: string;
  content: string;
  startDate: string;
  endDate: string;
  statusId: number;
};

export type TaskWithStatus = RenameKeys<ProjectStatus, StatusKeyMapping> & Task;
export type TaskListWithStatus = ProjectStatus & { tasks: Task[] };
