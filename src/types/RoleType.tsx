import type { User } from '@/types/UserType';

export type TeamRoleName = 'HEAD' | 'LEADER' | 'MATE';

export type ProjectRoleName = 'ADMIN' | 'LEADER' | 'ASSIGNEE';

export type RoleName = TeamRoleName | ProjectRoleName;

export type RoleInfo = {
  roleName: RoleName;
  label: string;
  description: string;
};

export type Role = {
  roleId: number;
  roleName: RoleName;
  roleType: 'TEAM' | 'PROJECT';
};

export type UpdateRole = {
  userId: User['userId'];
  roleName: ProjectRoleName;
};
