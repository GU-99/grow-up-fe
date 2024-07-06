import { useMemo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskItem from '@components/task/kanban/TaskItem';
import { generatePrefixId } from '@utils/converter';
import { DND_DRAGGABLE_PREFIX, DND_DROPPABLE_PREFIX, DND_TYPE } from '@constants/dnd';
import type { Task } from '@/types/TaskType';

type TaskItemListProps = {
  statusId: number;
  color: string;
  tasks: Task[];
};

export default function TaskItemList({ statusId, color, tasks }: TaskItemListProps) {
  const droppableId = useMemo(() => generatePrefixId(statusId, DND_DROPPABLE_PREFIX.TASK), [statusId]);
  return (
    <Droppable droppableId={droppableId} type={DND_TYPE.TASK}>
      {(taskDropProvided) => (
        <article
          style={{ borderColor: color }}
          className="h-full w-full grow border-l-[3px] bg-scroll"
          ref={taskDropProvided.innerRef}
          {...taskDropProvided.droppableProps}
        >
          {tasks.map((task) => {
            const { taskId, name, order } = task;
            const draggableId = generatePrefixId(taskId, DND_DRAGGABLE_PREFIX.TASK);
            const index = order - 1;
            return <TaskItem key={taskId} draggableId={draggableId} color={color} index={index} name={name} />;
          })}
          {taskDropProvided.placeholder}
        </article>
      )}
    </Droppable>
  );
}
