import type { Task } from '@/types/TaskType';
import type { Team } from '@/types/TeamType';
import type { Project } from '@/types/ProjectType';
import type { User } from '@/types/UserType';

export const queryKeys = {
  userInfo: 'userInfo',
  links: 'links',
  users: 'users',
  teams: 'teams',
  projects: 'projects',
  statuses: 'statuses',
  tasks: 'tasks',
  files: 'files',
  assignees: 'assignees',
  coworkers: 'coworkers',
};

/**
 * 유저 프로필 정보 queryKey 생성 함수
 *
 * @export
 * @returns {(string | number)[]}
 */
export function generateUserInfoQueryKey() {
  return [queryKeys.userInfo];
}

/**
 * 유저 링크 queryKey 생성 함수
 *
 * @export
 * @param {userId: User['userId']} userId - 유저의 고유 ID
 * @returns {(string | number)[]}
 */
export function generateLinksQueryKey(userId: User['userId']) {
  return [queryKeys.links, userId];
}

/**
 * 유저의 팀 목록 queryKey 생성 함수
 *
 * @export\
 * @param {userId: User['userId']} userId
 * @returns {(string | number)[]}
 */
export function generateTeamsQueryKey(userId: User['userId']) {
  return [queryKeys.teams, userId];
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
 * 팀원의 목록 queryKey 생성 함수
 *
 * @export
 * @param {Team['teamId']} teamId - 팀 ID
 * @returns {(string | number)[]}
 */
export function generateTeamCoworkersQueryKey(teamId: Team['teamId']) {
  return [queryKeys.teams, teamId, queryKeys.coworkers];
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
