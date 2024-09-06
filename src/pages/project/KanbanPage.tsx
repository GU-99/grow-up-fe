import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import ProjectStatusContainer from '@components/task/kanban/ProjectStatusContainer';
import { DND_DROPPABLE_PREFIX, DND_TYPE } from '@constants/dnd';
import deepClone from '@utils/deepClone';
import { parsePrefixId } from '@utils/converter';
import { useReadStatusTasks } from '@hooks/query/useTaskQuery';
import useProjectContext from '@hooks/useProjectContext';
import type { Task, TaskListWithStatus } from '@/types/TaskType';

function createChangedStatus(statusTasks: TaskListWithStatus[], dropResult: DropResult) {
  const { source, destination } = dropResult;

  if (!destination) throw Error('Error: DnD destination is null');

  const newStatusTasks = deepClone(statusTasks);
  const statusTask = newStatusTasks[source.index];

  newStatusTasks.splice(source.index, 1);
  newStatusTasks.splice(destination.index, 0, statusTask);
  newStatusTasks.forEach((status, index) => (status.sortOrder = index + 1));

  return newStatusTasks;
}

function createChangedTasks(statusTasks: TaskListWithStatus[], dropResult: DropResult, isSameStatus: boolean) {
  const { source, destination, draggableId } = dropResult;

  // ToDo: 메세지 포맷 정하고 수정하기
  if (!destination) throw Error('Error: DnD destination is null');

  const sourceStatusId = Number(parsePrefixId(source.droppableId));
  const destinationStatusId = Number(parsePrefixId(destination.droppableId));
  const taskId = Number(parsePrefixId(draggableId));

  const newStatusTasks = deepClone(statusTasks);
  const sourceTasks = newStatusTasks.find((data) => data.statusId === sourceStatusId)!.tasks;
  const destinationTasks = isSameStatus
    ? sourceTasks
    : newStatusTasks.find((data) => data.statusId === destinationStatusId)!.tasks;
  const task = sourceTasks.find((data) => data.taskId === taskId)! as Task;

  sourceTasks.splice(source.index, 1);
  destinationTasks.splice(destination.index, 0, task);

  sourceTasks.forEach((task, index) => (task.sortOrder = index + 1));
  if (!isSameStatus) destinationTasks.forEach((task, index) => (task.sortOrder = index + 1));

  return newStatusTasks;
}

// ToDo: DnD시 가시성을 위한 애니메이션 처리 추가할 것
export default function KanbanPage() {
  const { project } = useProjectContext();
  const { statusTaskList } = useReadStatusTasks(project.projectId);

  const handleDragEnd = (dropResult: DropResult) => {
    const { source, destination, type } = dropResult;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === DND_TYPE.STATUS) {
      const newStatusList = createChangedStatus(statusTaskList, dropResult);
      // return setStatusTasks(newStatusList);
    }

    if (type === DND_TYPE.TASK) {
      const isSameStatus = source.droppableId === destination.droppableId;
      const newStatusList = createChangedTasks(statusTaskList, dropResult, isSameStatus);
      // return setStatusTasks(newStatusTasks);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={DND_DROPPABLE_PREFIX.STATUS} type={DND_TYPE.STATUS} direction="horizontal">
        {(statusDropProvided) => (
          <section
            className="flex grow gap-10 pt-10"
            ref={statusDropProvided.innerRef}
            {...statusDropProvided.droppableProps}
          >
            {statusTaskList.map((statusTask) => (
              <ProjectStatusContainer key={statusTask.statusId} statusTask={statusTask} />
            ))}
            {statusDropProvided.placeholder}
          </section>
        )}
      </Droppable>
    </DragDropContext>
  );
}
