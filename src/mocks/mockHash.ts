import { PROJECT_DUMMY, ROLE_DUMMY, STATUS_DUMMY, TASK_DUMMY, TEAM_DUMMY, USER_DUMMY } from '@mocks/mockData';
import type { User } from '@/types/UserType';
import type { Role } from '@/types/RoleType';
import type { Team } from '@/types/TeamType';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus } from '@/types/ProjectStatusType';
import type { Task } from '@/types/TaskType';

type Hash<T> = {
  [key: string | number]: T;
};

// ToDo: MSW 처리중 해쉬 테이블 처리를 사용하는 부분 대체해주기
export function getUserHash() {
  const userHash: Hash<User> = {};
  USER_DUMMY.forEach((user) => (userHash[user.userId] = user));
  return userHash;
}

export function getRoleHash() {
  const roleHash: Hash<Role> = {};
  ROLE_DUMMY.forEach((role) => (roleHash[role.roleId] = role));
  return roleHash;
}

export function getTeamHash() {
  const teamHash: Hash<Team> = {};
  TEAM_DUMMY.forEach((team) => (teamHash[team.teamId] = team));
  return teamHash;
}

export function getProjectHash() {
  const projectHash: Hash<Project> = {};
  PROJECT_DUMMY.forEach((project) => (projectHash[project.projectId] = project));
  return projectHash;
}

export function getStatusHash() {
  const statusHash: Hash<ProjectStatus> = {};
  STATUS_DUMMY.forEach((status) => (statusHash[status.statusId] = status));
  return statusHash;
}

export function getTaskHash() {
  const taskHash: Hash<Task> = {};
  TASK_DUMMY.forEach((task) => (taskHash[task.taskId] = task));
  return taskHash;
}
