import { useMemo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskItem from '@components/task/kanban/TaskItem';
import { generatePrefixId } from '@utils/converter';
import { DND_DROPPABLE_PREFIX, DND_TYPE } from '@constants/dnd';
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
          className="h-full overflow-auto border-l-[3px] bg-scroll"
          ref={taskDropProvided.innerRef}
          {...taskDropProvided.droppableProps}
        >
          {tasks.map((task) => (
            <TaskItem key={task.taskId} task={task} colorCode={colorCode} />
          ))}
          {taskDropProvided.placeholder}
        </article>
      )}
    </Droppable>
  );
}
