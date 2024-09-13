import { useMemo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { generatePrefixId } from '@utils/converter';
import { DND_DRAGGABLE_PREFIX } from '@constants/dnd';
import useModal from '@hooks/useModal';
import useProjectContext from '@hooks/useProjectContext';
import DetailModalTask from '@components/modal/task/DetailModalTask';
import type { Task } from '@/types/TaskType';
import type { ProjectStatus } from '@/types/ProjectStatusType';

type TaskItemProps = {
  task: Task;
  colorCode: ProjectStatus['colorCode'];
};

export default function TaskItem({ task, colorCode }: TaskItemProps) {
  const { project } = useProjectContext();
  const { showModal, openModal, closeModal } = useModal();

  const { taskId, name, sortOrder } = task;
  const index = useMemo(() => sortOrder - 1, [sortOrder]);
  const draggableId = useMemo(() => generatePrefixId(taskId, DND_DRAGGABLE_PREFIX.TASK), [taskId]);

  const handleTaskClick = () => openModal();

  return (
    <>
      <Draggable draggableId={draggableId} index={index}>
        {(dragProvided) => (
          <div
            role="menuitem"
            tabIndex={0}
            onClick={handleTaskClick}
            onKeyUp={undefined}
            className="m-5 flex h-30 items-center justify-start gap-5 rounded-sl bg-[#FEFEFE] p-5"
            ref={dragProvided.innerRef}
            {...dragProvided.draggableProps}
            {...dragProvided.dragHandleProps}
          >
            <div style={{ borderColor: colorCode }} className="size-8 shrink-0 rounded-full border" />
            <div className="select-none truncate">{name}</div>
          </div>
        )}
      </Draggable>
      {showModal && <DetailModalTask project={project} task={task} onClose={closeModal} />}
    </>
  );
}
