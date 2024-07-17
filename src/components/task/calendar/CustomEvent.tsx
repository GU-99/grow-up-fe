import { Event, EventProps } from 'react-big-calendar';
import { TaskWithStatus } from '@/types/TaskType';

export type CustomEvents = Event & {
  task: TaskWithStatus;
  handleEventClick: (task: TaskWithStatus) => void;
};

export default function CustomEvent({ event }: EventProps<CustomEvents>) {
  return (
    <div style={{ backgroundColor: event.task.color }} className="overflow-hidden text-ellipsis rounded-md px-3 py-1">
      <span>{event.task.name}</span>
    </div>
  );
}
