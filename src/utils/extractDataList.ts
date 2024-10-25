import { PROJECT_STATUS_COLORS } from '@/constants/projectStatus';
import type { Team } from '@/types/TeamType';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus, UsableColor } from '@/types/ProjectStatusType';
import type { Task, TaskListWithStatus } from '@/types/TaskType';

// 일정 이름 목록 추출
export function getTaskNameList(taskList: TaskListWithStatus[], excludedTaskName?: Task['taskName']) {
  const taskNameList = taskList.flatMap((statusTask) => statusTask.tasks).map((task) => task.taskName);

  return excludedTaskName ? taskNameList.filter((taskName) => taskName !== excludedTaskName) : taskNameList;
}

// 프로젝트 이름 목록 추출
export function getProjectNameList(projectList: Project[], excludedProjectName?: Project['projectName']) {
  const projectNameList = projectList.map((project) => project.projectName);

  return excludedProjectName
    ? projectNameList.filter((projectName) => projectName !== excludedProjectName)
    : projectNameList;
}

// 팀 이름 목록 추출
export function getTeamNameList(teamList: Team[], excludedTeamName?: Team['teamName']) {
  const teamNameList = teamList.map((team) => team.teamName);

  return excludedTeamName ? teamNameList.filter((teamName) => teamName !== excludedTeamName) : teamNameList;
}

// 프로젝트 상태 이름 목록 추출
export function getStatusNameList(statusList: ProjectStatus[], excludedName?: ProjectStatus['statusName']) {
  const statusNameList = statusList.map((projectStatus) => projectStatus.statusName);

  const statusNameSet = new Set(statusNameList);
  if (excludedName && statusNameSet.has(excludedName)) {
    statusNameSet.delete(excludedName);
  }

  return [...statusNameSet.values()];
}

// 프로젝트 상태 색상 이름 추출
export function getStatusColorList(statusList: ProjectStatus[], excludedColor?: ProjectStatus['colorCode']) {
  const statusColorList = statusList.map((projectStatus) => projectStatus.colorCode);

  const statusColorSet = new Set(statusColorList);
  if (excludedColor && statusColorSet.has(excludedColor)) {
    statusColorSet.delete(excludedColor);
  }

  return [...statusColorSet.values()];
}

// 사용할 수 있는 색상 목록 추출
export function getUsableStatusColorList(
  statusList: ProjectStatus[],
  excludedColor?: ProjectStatus['colorCode'],
): UsableColor[] {
  const statusColorMap = new Map();
  Object.values(PROJECT_STATUS_COLORS).forEach((colorCode) => {
    statusColorMap.set(colorCode, { colorCode, isUsable: true });
  });

  statusList.forEach(({ colorCode }) => {
    if (!statusColorMap.has(colorCode)) throw Error('[Error] 등록되지 않은 색상입니다.');

    if (excludedColor === colorCode) return;
    statusColorMap.set(colorCode, { ...statusColorMap.get(colorCode), isUsable: false });
  });

  return [...statusColorMap.values()];
}
