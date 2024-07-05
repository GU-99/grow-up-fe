import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { BsPencil } from 'react-icons/bs';
import deepClone from '@utils/deepClone';

import { TASK_DUMMY } from '@mocks/mockData';
import type { DropResult } from '@hello-pangea/dnd';
import type { Task, TaskWithStatus } from '@/types/TaskType';

// ToDo: 유틸리티로 분리할지 고려하기
function generatorPrefixId(id: number | string, prefix: string, delimiter: string = '-') {
  const result = prefix + delimiter + id;
  return result;
}
function parserPrefixId(prefixId: string, delimiter: string = '-') {
  const result = prefixId.split(delimiter);
  return result[result.length - 1];
}

function createChangedStatusTasks(statusTasks: TaskWithStatus[], dropResult: DropResult, isSameStatus: boolean) {
  const { source, destination, draggableId } = dropResult;

  // ToDo: 메세지 포맷 정하고 수정하기
  if (!destination) throw Error('Error: DnD destination is null');

  const sourceStatusId = Number(parserPrefixId(source.droppableId));
  const destinationStatusId = Number(parserPrefixId(destination.droppableId));
  const taskId = Number(parserPrefixId(draggableId));

  const newStatusTasks = deepClone(statusTasks);
  const { tasks: sourceTasks } = newStatusTasks.find((data) => data.statusId === sourceStatusId)! as TaskWithStatus;
  const { tasks: destinationTasks } = isSameStatus
    ? { tasks: sourceTasks }
    : (newStatusTasks.find((data) => data.statusId === destinationStatusId)! as TaskWithStatus);
  const task = sourceTasks.find((data) => data.taskId === taskId)! as Task;

  sourceTasks.splice(source.index, 1);
  destinationTasks.splice(destination.index, 0, task);

  sourceTasks.forEach((task, index) => (task.order = index + 1));
  if (!isSameStatus) destinationTasks.forEach((task, index) => (task.order = index + 1));

  return newStatusTasks;
}

// ToDo: 할일 상태 Vertical DnD 추가할 것
// ToDo: DnD시 가시성을 위한 애니메이션 처리 추가할 것
// ToDo: 칸반보드 ItemList, Item 컴포넌트로 분리할 것
export default function KanbanPage() {
  const [statusTasks, setStatusTasks] = useState<TaskWithStatus[]>(TASK_DUMMY);

  const handleDragEnd = (dropResult: DropResult) => {
    const { source, destination } = dropResult;

    if (!destination) return;

    const isSameStatus = source.droppableId === destination.droppableId;
    const isSameTask = source.index === destination.index;
    if (isSameStatus && isSameTask) return;

    const newStatusTasks = createChangedStatusTasks(statusTasks, dropResult, isSameStatus);
    setStatusTasks(newStatusTasks);
  };

  return (
    <section className="flex grow gap-10 pt-10">
      <DragDropContext onDragEnd={handleDragEnd}>
        {statusTasks.map((data) => {
          const { statusId, name, color, tasks } = data;
          const droppableId = generatorPrefixId(statusId, 'status');
          return (
            <article className="flex min-w-125 grow basis-1/3 flex-col" key={statusId}>
              <header className="flex items-center gap-4">
                <h2 className="font-bold text-emphasis">{name}</h2>
                <span>
                  <BsPencil className="cursor-pointer" />
                </span>
              </header>
              <div className="grow">
                <Droppable droppableId={droppableId} type="TASK">
                  {(dropProvided) => {
                    return (
                      <article
                        style={{ borderColor: color }}
                        className="inline-block min-h-full w-full border-l-[3px] bg-scroll"
                        ref={dropProvided.innerRef}
                        {...dropProvided.droppableProps}
                      >
                        {tasks.map((task) => {
                          const { taskId, name, order } = task;
                          const draggableId = generatorPrefixId(taskId, 'task');
                          const index = order - 1;
                          return (
                            <Draggable key={taskId} draggableId={draggableId} index={index}>
                              {(dragProvided) => {
                                return (
                                  <div
                                    className="m-5 flex h-30 items-center justify-start gap-5 rounded-sl bg-[#FEFEFE] p-5"
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                  >
                                    <div style={{ borderColor: color }} className="h-8 w-8 rounded-full border" />
                                    <div className="select-none overflow-hidden text-ellipsis text-nowrap">{name}</div>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {dropProvided.placeholder}
                      </article>
                    );
                  }}
                </Droppable>
              </div>
            </article>
          );
        })}
      </DragDropContext>
    </section>
  );
}
