import { useMemo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskItem from '@components/task/kanban/TaskItem';
import { generatePrefixId } from '@utils/converter';
import { DND_DRAGGABLE_PREFIX, DND_DROPPABLE_PREFIX, DND_TYPE } from '@constants/dnd';
import type { Task } from '@/types/TaskType';

type TaskItemListProps = {
  statusId: number;
  colorCode: string;
  tasks: Task[];
};

export default function TaskItemList({ statusId, colorCode, tasks }: TaskItemListProps) {
  const droppableId = useMemo(() => generatePrefixId(statusId, DND_DROPPABLE_PREFIX.TASK), [statusId]);
  return (
    <Droppable droppableId={droppableId} type={DND_TYPE.TASK}>
      {(taskDropProvided) => (
        <article
          style={{ borderColor: colorCode }}
          className="h-full w-full grow border-l-[3px] bg-scroll"
          ref={taskDropProvided.innerRef}
          {...taskDropProvided.droppableProps}
        >
          {tasks.map((task) => {
            const { taskId, name, order } = task;
            const draggableId = generatePrefixId(taskId, DND_DRAGGABLE_PREFIX.TASK);
            const index = order - 1;
            return <TaskItem key={taskId} draggableId={draggableId} colorCode={colorCode} index={index} name={name} />;
          })}
          {taskDropProvided.placeholder}
        </article>
      )}
    </Droppable>
  );
}
