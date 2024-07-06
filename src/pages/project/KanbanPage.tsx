import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { BsPencil } from 'react-icons/bs';
import deepClone from '@utils/deepClone';

import { TASK_DUMMY } from '@mocks/mockData';
import type { DropResult } from '@hello-pangea/dnd';
import type { Task, TaskWithStatus } from '@/types/TaskType';

const DND_TYPE = {
  STATUS: 'STATUS',
  TASK: 'TASK',
};

// ToDo: 유틸리티로 분리할지 고려하기
function generatorPrefixId(id: number | string, prefix: string, delimiter: string = '-') {
  return `${prefix}${delimiter}${id}`;
}
function parserPrefixId(prefixId: string, delimiter: string = '-') {
  const result = prefixId.split(delimiter);
  return result[result.length - 1];
}

function createChangedStatus(statusTasks: TaskWithStatus[], dropResult: DropResult) {
  const { source, destination } = dropResult;

  if (!destination) throw Error('Error: DnD destination is null');

  const newStatusTasks = deepClone(statusTasks);
  const stausTask = newStatusTasks[source.index];
  newStatusTasks.splice(source.index, 1);
  newStatusTasks.splice(destination.index, 0, stausTask);
  newStatusTasks.forEach((status, index) => (status.order = index + 1));
  return newStatusTasks;
}

function createChangedTasks(statusTasks: TaskWithStatus[], dropResult: DropResult, isSameStatus: boolean) {
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

// ToDo: DnD시 가시성을 위한 애니메이션 처리 추가할 것
// ToDo: 칸반보드 ItemList, Item 컴포넌트로 분리할 것
export default function KanbanPage() {
  const [statusTasks, setStatusTasks] = useState<TaskWithStatus[]>(TASK_DUMMY);

  const handleDragEnd = (dropResult: DropResult) => {
    const { source, destination, type } = dropResult;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === DND_TYPE.STATUS) {
      const newStatusTasks = createChangedStatus(statusTasks, dropResult);
      return setStatusTasks(newStatusTasks);
    }

    if (type === DND_TYPE.TASK) {
      const isSameStatus = source.droppableId === destination.droppableId;
      const newStatusTasks = createChangedTasks(statusTasks, dropResult, isSameStatus);
      return setStatusTasks(newStatusTasks);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="container" direction="horizontal" type={DND_TYPE.STATUS}>
        {(statusDropProvided) => (
          <section
            className="flex grow gap-10 pt-10"
            ref={statusDropProvided.innerRef}
            {...statusDropProvided.droppableProps}
          >
            {statusTasks.map((data) => {
              const { statusId, name, color, order, tasks } = data;
              const draggableId = generatorPrefixId(statusId, 'status-drag');
              const droppableId = generatorPrefixId(statusId, 'status');
              const index = order - 1;
              return (
                <Draggable draggableId={draggableId} index={index} key={statusId}>
                  {(statusDragProvided) => (
                    <article
                      className="flex min-w-125 grow basis-1/3 flex-col"
                      ref={statusDragProvided.innerRef}
                      {...statusDragProvided.draggableProps}
                    >
                      <header className="flex items-center gap-4" {...statusDragProvided.dragHandleProps}>
                        <h2 className="font-bold text-emphasis">{name}</h2>
                        <span>
                          <BsPencil className="cursor-pointer" />
                        </span>
                      </header>
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
                              const draggableId = generatorPrefixId(taskId, 'task');
                              const index = order - 1;
                              return (
                                <Draggable key={taskId} draggableId={draggableId} index={index}>
                                  {(dragProvided) => (
                                    <div
                                      className="m-5 flex h-30 items-center justify-start gap-5 rounded-sl bg-[#FEFEFE] p-5"
                                      ref={dragProvided.innerRef}
                                      {...dragProvided.draggableProps}
                                      {...dragProvided.dragHandleProps}
                                    >
                                      <div style={{ borderColor: color }} className="h-8 w-8 rounded-full border" />
                                      <div className="select-none overflow-hidden text-ellipsis text-nowrap">
                                        {name}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {taskDropProvided.placeholder}
                          </article>
                        )}
                      </Droppable>
                    </article>
                  )}
                </Draggable>
              );
            })}
            {statusDropProvided.placeholder}
          </section>
        )}
      </Droppable>
    </DragDropContext>
  );
}
