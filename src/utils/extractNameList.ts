import type { Task, TaskListWithStatus } from '@/types/TaskType';
import type { Project } from '@/types/ProjectType';
import type { Team } from '@/types/TeamType';

export function getTaskNameList(taskList: TaskListWithStatus[], excludedTaskName?: Task['taskName']) {
  const taskNameList = taskList.flatMap((statusTask) => statusTask.tasks).map((task) => task.taskName);

  return excludedTaskName ? taskNameList.filter((taskName) => taskName !== excludedTaskName) : taskNameList;
}

export function getProjectNameList(projectList: Project[], excludedProjectName?: Project['projectName']) {
  const projectNameList = projectList.map((project) => project.projectName);

  return excludedProjectName
    ? projectNameList.filter((projectName) => projectName !== excludedProjectName)
    : projectNameList;
}

export function getTeamNameList(teamList: Team[], excludedTeamName?: Team['teamName']) {
  const teamNameList = teamList.map((team) => team.teamName);

  return excludedTeamName ? teamNameList.filter((teamName) => teamName !== excludedTeamName) : teamNameList;
}
