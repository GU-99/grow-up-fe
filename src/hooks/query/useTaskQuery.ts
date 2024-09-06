import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { findTaskList, updateTaskOrder } from '@services/taskService';

import type { TaskListWithStatus, TaskOrder } from '@/types/TaskType';
import type { Project } from '@/types/ProjectType';

function getTaskNameList(taskList: TaskListWithStatus[]) {
  return taskList.length > 0
    ? taskList
        .map((statusTask) => statusTask.tasks)
        .flat()
        .map((task) => task.name)
    : [];
}

// Todo: Task Query CUD로직 작성하기
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
  const queryClient = useQueryClient();
  const queryKey = ['projects', projectId, 'tasks'];

  const mutation = useMutation({
    mutationFn: (newStatusTaskList: TaskListWithStatus[]) => {
      const taskOrders: TaskOrder[] = newStatusTaskList
        .map((statusTask) => {
          const { statusId, tasks } = statusTask;
          const taskOrder = tasks.map(({ taskId, sortOrder }) => ({ statusId, taskId, sortOrder }));
          return taskOrder;
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
      queryClient.setQueryData(queryKey, context?.previousStatusTaskList);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return mutation;
}
