import { TaskStatus } from './TaskStatusType';

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

export type TaskWithStatus = TaskStatus & { tasks: Task[] };
