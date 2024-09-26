export type RoleName = 'HEAD' | 'LEADER' | 'MATE' | 'ADMIN' | 'ASSIGNEE';

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
