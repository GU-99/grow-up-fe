import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, findTaskList, updateTaskOrder } from '@services/taskService';
import useToast from '@hooks/useToast';

import type { TaskForm, TaskListWithStatus, TaskOrder } from '@/types/TaskType';
import type { Project } from '@/types/ProjectType';

function getTaskNameList(taskList: TaskListWithStatus[]) {
  return taskList.length > 0
    ? taskList
        .map((statusTask) => statusTask.tasks)
        .flat()
        .map((task) => task.name)
    : [];
}

// Todo: Task Query UD로직 작성하기
export function useCreateStatusTask(projectId: Project['projectId']) {
  const { toastSuccess } = useToast();
  const queryClient = useQueryClient();
  const queryKey = ['projects', projectId, 'tasks'];

  const mutation = useMutation({
    mutationFn: (formData: TaskForm) => createTask(projectId, formData),
    onSuccess: () => {
      toastSuccess('프로젝트 일정을 등록하였습니다.');
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return mutation;
}

export function useReadStatusTasks(projectId: Project['projectId']) {
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

  const taskNameList = getTaskNameList(statusTaskList);

  return { statusTaskList, taskNameList, isTaskLoading, isTaskError, taskError };
}

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
