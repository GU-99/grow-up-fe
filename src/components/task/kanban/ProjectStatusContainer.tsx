import { useMemo, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import TaskItemList from '@components/task/kanban/TaskItemList';
import UpdateModalProjectStatus from '@components/modal/project-status/UpdateModalProjectStatus';
import { generatePrefixId } from '@utils/converter';
import { DND_DRAGGABLE_PREFIX } from '@constants/dnd';
import { BsPencil } from 'react-icons/bs';
import { TaskWithStatus } from '@/types/TaskType';

type TaskStatusContainerProps = {
  statusTask: TaskWithStatus;
};

export default function TaskStatusContainer({ statusTask }: TaskStatusContainerProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const { statusId, name, color, order, tasks } = statusTask;
  const draggableId = useMemo(() => generatePrefixId(statusId, DND_DRAGGABLE_PREFIX.STATUS), [statusId]);
  const index = useMemo(() => order - 1, [order]);

  return (
    <>
      <Draggable draggableId={draggableId} index={index}>
        {(statusDragProvided) => (
          <article
            className="flex min-w-125 grow basis-1/3 flex-col"
            ref={statusDragProvided.innerRef}
            {...statusDragProvided.draggableProps}
          >
            <header className="flex items-center gap-4" {...statusDragProvided.dragHandleProps}>
              <h2 className="select-none font-bold text-emphasis">{name}</h2>
              <span>
                <BsPencil
                  className="cursor-pointer hover:scale-110 hover:text-main hover:duration-150"
                  onClick={() => setShowStatusModal(true)}
                />
              </span>
            </header>
            <TaskItemList statusId={statusId} color={color} tasks={tasks} />
          </article>
        )}
      </Draggable>
      {showStatusModal && (
        <UpdateModalProjectStatus onClose={() => setShowStatusModal(false)} statusId={statusTask.statusId} />
      )}
    </>
  );
}
