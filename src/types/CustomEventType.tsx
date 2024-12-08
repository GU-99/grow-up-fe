import { Event } from 'react-big-calendar';
import { TaskWithStatus } from '@/types/TaskType';

export type CustomEvent = Event & {
  task: TaskWithStatus;
};
