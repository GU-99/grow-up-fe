import { PROJECT_ROLES_PRIORITY, TEAM_ROLES_PRIORITY } from '@constants/role';

export type RolePriorityMap = Record<string, number>;
export type RolePriority<T extends Roles> = [T] extends [TeamRoles] ? TeamRolesPriority : ProjectRolesPriority;

export type TeamRolesPriority = typeof TEAM_ROLES_PRIORITY;
export type ProjectRolesPriority = typeof PROJECT_ROLES_PRIORITY;

export type TeamRoles = keyof TeamRolesPriority;
export type ProjectRoles = keyof ProjectRolesPriority;

export type Roles = TeamRoles | ProjectRoles;

export type RoleInfo = {
  roleName: Roles;
  label: string;
  description: string;
};

export type Role = {
  roleId: number;
  roleName: Roles | null;
  roleType: 'TEAM' | 'PROJECT';
};
