import type { Task, TaskListWithStatus } from '@/types/TaskType';

export function getTaskNameList(taskList: TaskListWithStatus[], excludedTaskName?: Task['taskName']) {
  const taskNameList = taskList
    .map((statusTask) => statusTask.tasks)
    .flat()
    .map((task) => task.taskName);

  return excludedTaskName ? taskNameList.filter((taskName) => taskName !== excludedTaskName) : taskNameList;
}
