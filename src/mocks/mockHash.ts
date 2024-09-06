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
export const USERS_HASH: Hash<User> = {};
USER_DUMMY.forEach((user) => (USERS_HASH[user.userId] = user));

export const ROLES_HASH: Hash<Role> = {};
ROLE_DUMMY.forEach((role) => (ROLES_HASH[role.roleId] = role));

export const TEAMS_HASH: Hash<Team> = {};
TEAM_DUMMY.forEach((team) => (TEAMS_HASH[team.teamId] = team));

export const PROJECTS_HASH: Hash<Project> = {};
PROJECT_DUMMY.forEach((project) => (PROJECTS_HASH[project.projectId] = project));

export const STATUSES_HASH: Hash<ProjectStatus> = {};
STATUS_DUMMY.forEach((status) => (STATUSES_HASH[status.statusId] = status));

export const TASK_HASH: Hash<Task> = {};
TASK_DUMMY.forEach((task) => (TASK_HASH[task.taskId] = task));
