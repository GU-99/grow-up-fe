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
