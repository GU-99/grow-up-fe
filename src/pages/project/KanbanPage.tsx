import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { DND_DROPPABLE_PREFIX, DND_TYPE } from '@constants/dnd';
import Meta from '@components/common/Meta';
import ProjectStatusContainer from '@components/task/kanban/ProjectStatusContainer';
import deepClone from '@utils/deepClone';
import { parsePrefixId } from '@utils/converter';
import useProjectContext from '@hooks/useProjectContext';
import { useUpdateStatusesOrder } from '@hooks/query/useStatusQuery';
import { useReadStatusTasks, useUpdateTasksOrder } from '@hooks/query/useTaskQuery';
import type { Task, TaskListWithStatus } from '@/types/TaskType';

// 상태 순서 변경
function createChangedStatus(statusTasks: TaskListWithStatus[], dropResult: DropResult) {
  const { source, destination } = dropResult;

  if (!destination) throw Error('원하는 영역에 확실히 넣어주세요.');

  const newStatusTasks = deepClone(statusTasks);
  const statusTask = newStatusTasks[source.index];

  newStatusTasks.splice(source.index, 1);
  newStatusTasks.splice(destination.index, 0, statusTask);
  newStatusTasks.forEach((status, index) => (status.sortOrder = index + 1));

  return newStatusTasks;
}

// 일정 순서 변경
function createChangedTasks(statusTasks: TaskListWithStatus[], dropResult: DropResult, isSameStatus: boolean) {
  const { source, destination, draggableId } = dropResult;

  if (!destination) throw Error('원하는 영역에 확실히 넣어주세요.');

  const sourceStatusId = Number(parsePrefixId(source.droppableId));
  const destinationStatusId = Number(parsePrefixId(destination.droppableId));
  const taskId = Number(parsePrefixId(draggableId));

  const newStatusTasks = deepClone(statusTasks);
  const sourceTasks = newStatusTasks.find((data) => data.statusId === sourceStatusId)!.tasks;
  const destinationTasks = isSameStatus
    ? sourceTasks
    : newStatusTasks.find((data) => data.statusId === destinationStatusId)!.tasks;
  const task = sourceTasks.find((data) => data.taskId === taskId)! as Task;
  task.statusId = destinationStatusId;

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
  const { mutate: updateTaskOrderMutate } = useUpdateTasksOrder(project.projectId);
  const { mutate: updateStatusOrderMutate } = useUpdateStatusesOrder(project.projectId);
  const [localStatusTaskList, setLocalStatusTaskList] = useState(statusTaskList);

  useEffect(() => {
    if (statusTaskList) setLocalStatusTaskList(statusTaskList);
  }, [statusTaskList]);

  const handleDragEnd = (dropResult: DropResult) => {
    const { source, destination, type } = dropResult;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === DND_TYPE.STATUS) {
      const newStatusTaskList = createChangedStatus(localStatusTaskList, dropResult);
      setLocalStatusTaskList(newStatusTaskList);
      updateStatusOrderMutate(newStatusTaskList);
    }

    if (type === DND_TYPE.TASK) {
      const isSameStatus = source.droppableId === destination.droppableId;
      const newStatusTaskList = createChangedTasks(localStatusTaskList, dropResult, isSameStatus);
      setLocalStatusTaskList(newStatusTaskList);
      updateTaskOrderMutate(newStatusTaskList);
    }
  };

  return (
    <>
      <Meta title="Grow Up : 프로젝트 관리" />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={DND_DROPPABLE_PREFIX.STATUS} type={DND_TYPE.STATUS} direction="horizontal">
          {(statusDropProvided) => (
            <section
              className="flex grow gap-10"
              ref={statusDropProvided.innerRef}
              {...statusDropProvided.droppableProps}
            >
              {localStatusTaskList.map((statusTask) => (
                <ProjectStatusContainer key={statusTask.statusId} statusTask={statusTask} />
              ))}
              {statusDropProvided.placeholder}
            </section>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
