import { TASK_DUMMY } from '@mocks/mockData';
import { TaskListWithStatus } from '@/types/TaskType';
import { Project } from '@/types/ProjectType';

function getTaskNameList(taskList: TaskListWithStatus[]) {
  return taskList
    .map((statusTask) => statusTask.tasks)
    .flat()
    .map((task) => task.name);
}

// Todo: Task Query CRUD로직 작성하기
// QueryKey: project, projectId, tasks
export default function useTaskQuery(projectId: Project['projectId']) {
  const taskList = TASK_DUMMY;

  const taskNameList = taskList ? getTaskNameList(taskList) : [];

  return { taskList, taskNameList };
}
