import { useQuery } from '@tanstack/react-query';
import { findTaskList } from '@services/taskService';

import type { TaskListWithStatus } from '@/types/TaskType';
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
