import { findRoleByRoleName } from '@mocks/mockAPI';
import type { Team, TeamCoworkerForm } from '@/types/TeamType';
import { Project, ProjectCoworkerForm } from '@/types/ProjectType';

// 팀 유저 객체 생성 함수
export function createTeamUserFormat(coworker: TeamCoworkerForm, newTeamId: Team['teamId'], isPending: boolean) {
  const role = findRoleByRoleName(coworker.roleName);
  if (!role) throw new Error('유효하지 않은 역할입니다.');

  return {
    teamId: newTeamId,
    userId: coworker.userId,
    roleId: role.roleId,
    isPendingApproval: isPending,
  };
}

// 프로젝트 유저 객체 생성 함수
export function createProjectUserFormat(coworker: ProjectCoworkerForm, newProjectId: Project['projectId']) {
  const role = findRoleByRoleName(coworker.roleName);
  if (!role) throw new Error('유효하지 않은 역할입니다.');

  return {
    projectId: newProjectId,
    userId: coworker.userId,
    roleId: role.roleId,
  };
}
