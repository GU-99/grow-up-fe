import { useMemo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import useModal from '@hooks/useModal';
import useProjectContext from '@hooks/useProjectContext';
import TaskItemList from '@components/task/kanban/TaskItemList';
import UpdateModalProjectStatus from '@components/modal/project-status/UpdateModalProjectStatus';
import { generatePrefixId } from '@utils/converter';
import { DND_DRAGGABLE_PREFIX } from '@constants/dnd';
import { BsPencil } from 'react-icons/bs';
import { TaskListWithStatus } from '@/types/TaskType';

type TaskStatusContainerProps = {
  statusTask: TaskListWithStatus;
};

export default function TaskStatusContainer({ statusTask }: TaskStatusContainerProps) {
  const { project } = useProjectContext();
  const { showModal, openModal, closeModal } = useModal();
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
                  onClick={openModal}
                />
              </span>
            </header>
            <TaskItemList statusId={statusId} color={color} tasks={tasks} />
          </article>
        )}
      </Draggable>
      {showModal && <UpdateModalProjectStatus project={project} statusId={statusTask.statusId} onClose={closeModal} />}
    </>
  );
}
