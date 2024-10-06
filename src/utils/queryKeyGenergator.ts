import type { Task } from '@/types/TaskType';
import type { Team } from '@/types/TeamType';
import type { Project } from '@/types/ProjectType';

export const queryKeys = {
  users: 'users',
  teams: 'teams',
  projects: 'projects',
  statuses: 'statuses',
  tasks: 'tasks',
  files: 'files',
  assignees: 'assignees',
};

/**
 * 유저의 팀 목록 queryKey 생성 함수
 *
 * @export
 * @returns {(string | number)[]}
 */
export function generateTeamsQueryKey() {
  return [queryKeys.teams];
}

/**
 * 팀의 세부 정보 queryKey 생성 함수
 *
 * @export
 * @param {Team['teamId']} teamId - 팀의 ID
 * @returns {(string | number)[]}
 */
export function generateTeamQueryKey(teamId: Team['teamId']) {
  return [queryKeys.teams, teamId];
}

/**
 * 팀의 프로젝트 목록 queryKey 생성 함수
 *
 * @export
 * @param {Team['teamId']} teamId - 프로젝트 목록을 가져올 팀 ID
 * @returns {(string | number)[]}
 */
export function generateProjectsQueryKey(teamId: Team['teamId']) {
  return [queryKeys.teams, teamId, queryKeys.projects];
}

/**
 * 프로젝트의 팀원 목록 queryKey 생성함수
 *
 * @export
 * @param {Project['projectId']} projectId  - 팀원 목록을 가져올 프로젝트 ID
 * @returns {(string | number)[]}
 */
export function generateProjectUsersQueryKey(projectId: Project['projectId']) {
  return [queryKeys.projects, projectId, queryKeys.users];
}

/**
 * 프로젝트의 상태 목록 queryKey 생성 함수
 *
 * @export
 * @param {Project['projectId']} projectId  - 상태 목록을 가져올 프로젝트 ID
 * @returns {(string | number)[]}
 */
export function generateStatusesQueryKey(projectId: Project['projectId']) {
  return [queryKeys.projects, projectId, queryKeys.statuses];
}

/**
 * 단일 프로젝트 queryKey 생성
 *
 * @export
 * @param {Project['projectId']} projectId - 프로젝트 ID
 * @returns {(string | number)[]}
 */
export function generateProjectQueryKey(projectId: Project['projectId']) {
  return [queryKeys.projects, projectId];
}

/**
 * 프로젝트의 일정 목록 queryKey 생성 함수
 *
 * @export
 * @param {Project['projectId']} projectId   - 일정 목록을 가져올 프로젝트 ID
 * @returns {(string | number)[]}
 */
export function generateTasksQueryKey(projectId: Project['projectId']) {
  return [queryKeys.projects, projectId, queryKeys.tasks];
}

/**
 * 일정의 파일 목록 queryKey 생성 함수
 *
 * @export
 * @param {Project['projectId']} projectId  - 일정이 포함된 프로젝트 ID
 * @param {Task['taskId']} taskId           - 파일 목록을 가져올 일정 ID
 * @returns {(string | number)[]}
 */
export function generateTaskFilesQueryKey(projectId: Project['projectId'], taskId: Task['taskId']) {
  return [queryKeys.projects, projectId, queryKeys.tasks, taskId, queryKeys.files];
}

/**
 * 일정의 수행자 목록 queryKey 생성 함수
 *
 * @export
 * @param {Project['projectId']} projectId  - 일정이 포함된 프로젝트 ID
 * @param {Task['taskId']} taskId           - 수행자 목록을 가져올 일정 ID
 * @returns {(string | number)[]}
 */
export function generateTaskAssigneesQueryKey(projectId: Project['projectId'], taskId: Task['taskId']) {
  return [queryKeys.projects, projectId, queryKeys.tasks, taskId, queryKeys.assignees];
}
