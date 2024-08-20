export type Role = {
  roleId: number;
  roleName: 'HEAD' | 'LEADER' | 'MATE' | 'ADMIN' | 'ASSIGNEE';
  roleType: 'TEAM' | 'PROJECT';
};
