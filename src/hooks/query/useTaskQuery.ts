import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, findAssignees, findTaskFiles, findTaskList, updateTaskOrder } from '@services/taskService';
import useToast from '@hooks/useToast';

import type { Task, TaskCreationForm, TaskListWithStatus, TaskOrder } from '@/types/TaskType';
import type { Project } from '@/types/ProjectType';

function getTaskNameList(taskList: TaskListWithStatus[], excludedTaskName?: Task['name']) {
  const taskNameList =
    taskList.length > 0
      ? taskList
          .map((statusTask) => statusTask.tasks)
          .flat()
          .map((task) => task.name)
      : [];

  return excludedTaskName ? taskNameList.filter((taskName) => taskName !== excludedTaskName) : taskNameList;
}

// Todo: Task Query UD로직 작성하기
// 일정 생성
export function useCreateStatusTask(projectId: Project['projectId']) {
  const { toastSuccess } = useToast();
  const queryClient = useQueryClient();
  const queryKey = ['projects', projectId, 'tasks'];

  const mutation = useMutation({
    mutationFn: (formData: TaskCreationForm) => createTask(projectId, formData),
    onSuccess: () => {
      toastSuccess('프로젝트 일정을 등록하였습니다.');
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return mutation;
}

// 상태별 일정 목록 조회
export function useReadStatusTasks(projectId: Project['projectId'], taskId?: Task['taskId']) {
  const {
    data: statusTaskList = [],
    isLoading: isTaskLoading,
    isError: isTaskError,
    error: taskError,
  } = useQuery({
    queryKey: ['projects', projectId, 'tasks'],
    queryFn: async () => {
      const { data } = await findTaskList(projectId);
      return data;
    },
  });

  const task = useMemo(
    () =>
      statusTaskList
        .map((statusTask) => statusTask.tasks)
        .flat()
        .find((task) => task.taskId === taskId),
    [statusTaskList, taskId],
  );
  const taskNameList = useMemo(() => getTaskNameList(statusTaskList, task?.name), [statusTaskList, task?.name]);

  return { task, statusTaskList, taskNameList, isTaskLoading, isTaskError, taskError };
}

// 일정 목록 순서 변경
export function useUpdateTasksOrder(projectId: Project['projectId']) {
  const { toastError } = useToast();
  const queryClient = useQueryClient();
  const queryKey = ['projects', projectId, 'tasks'];

  const mutation = useMutation({
    mutationFn: (newStatusTaskList: TaskListWithStatus[]) => {
      const taskOrders: TaskOrder[] = newStatusTaskList
        .map((statusTask) => {
          const { statusId, tasks } = statusTask;
          return tasks.map(({ taskId, sortOrder }) => ({ statusId, taskId, sortOrder }));
        })
        .flat();
      return updateTaskOrder(projectId, { tasks: taskOrders });
    },
    onMutate: async (newStatusTaskList: TaskListWithStatus[]) => {
      await queryClient.cancelQueries({ queryKey });

      const previousStatusTaskList = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, newStatusTaskList);

      return { previousStatusTaskList };
    },
    onError: (err, newStatusTaskList, context) => {
      toastError('일정 순서 변경에 실패 하였습니다. 잠시후 다시 진행해주세요.');
      queryClient.setQueryData(queryKey, context?.previousStatusTaskList);
    },
  });

  return mutation;
}

// 일정 수행자 목록 조회
export function useReadAssignees(projectId: Project['projectId'], taskId: Task['taskId']) {
  const {
    data: assigneeList = [],
    isLoading: isAssigneeLoading,
    error: assigneeError,
    isError: isAssigneeError,
  } = useQuery({
    queryKey: ['projects', projectId, 'tasks', taskId, 'assignees'],
    queryFn: async () => {
      const { data } = await findAssignees(projectId, taskId);
      return data;
    },
  });

  return { assigneeList, isAssigneeLoading, assigneeError, isAssigneeError };
}

// 일정 파일 목록 조회
export function useReadTaskFiles(projectId: Project['projectId'], taskId: Task['taskId']) {
  const {
    data: taskFileList = [],
    isLoading: isTaskFileLoading,
    error: taskFileError,
    isError: isTaskFileError,
  } = useQuery({
    queryKey: ['projects', projectId, 'tasks', taskId, 'files'],
    queryFn: async () => {
      const { data } = await findTaskFiles(projectId, taskId);
      return data;
    },
  });
  return { taskFileList, isTaskFileLoading, taskFileError, isTaskFileError };
}
