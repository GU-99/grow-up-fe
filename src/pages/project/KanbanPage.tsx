import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { DND_DROPPABLE_PREFIX, DND_TYPE } from '@constants/dnd';
import Meta from '@components/common/Meta';
import ProjectStatusContainer from '@components/task/kanban/ProjectStatusContainer';
import deepClone from '@utils/deepClone';
import { parsePrefixId } from '@utils/converter';
import useToast from '@hooks/useToast';
import useProjectContext from '@hooks/useProjectContext';
import { useUpdateStatusesOrder } from '@hooks/query/useStatusQuery';
import { useReadStatusTasks, useUpdateTasksOrder } from '@hooks/query/useTaskQuery';
import type { TaskListWithStatus } from '@/types/TaskType';

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
  const sourceStatus = newStatusTasks.find((data) => data.statusId === sourceStatusId)!;
  const destinationStatus = isSameStatus
    ? sourceStatus
    : newStatusTasks.find((data) => data.statusId === destinationStatusId)!;

  // 출발지 프로젝트 상태 목록에서 일정 제거
  const taskIndex = sourceStatus.tasks.findIndex((data) => data.taskId === taskId);
  const [task] = sourceStatus.tasks.splice(taskIndex, 1);

  // 프로젝트 상태 변경 반영
  task.statusId = destinationStatusId;

  // 도착지 프로젝트 상태 목록에 일정 추가
  destinationStatus.tasks.splice(destination.index, 0, task);

  // 변경된 일정 목록에 대한 정렬 순서 재부여
  sourceStatus.tasks = sourceStatus.tasks.map((task, index) => ({ ...task, sortOrder: index + 1 }));
  destinationStatus.tasks = destinationStatus.tasks.map((task, index) => ({ ...task, sortOrder: index + 1 }));

  return newStatusTasks;
}

// ToDo: DnD시 가시성을 위한 애니메이션 처리 추가할 것
export default function KanbanPage() {
  const { toastError } = useToast();
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

    try {
      if (type === DND_TYPE.STATUS) {
        setLocalStatusTaskList((prevStatusTaskList) => {
          const newStatusTaskList = createChangedStatus(prevStatusTaskList, dropResult);
          updateStatusOrderMutate(newStatusTaskList);
          return newStatusTaskList;
        });
      }

      if (type === DND_TYPE.TASK) {
        setLocalStatusTaskList((prevStatusTaskList) => {
          const isSameStatus = source.droppableId === destination.droppableId;
          const newStatusTaskList = createChangedTasks(prevStatusTaskList, dropResult, isSameStatus);
          updateTaskOrderMutate(newStatusTaskList);
          return newStatusTaskList;
        });
      }
    } catch (error) {
      toastError((error as Error).message || '순서를 변경하는 중 오류가 발생했습니다.');
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
