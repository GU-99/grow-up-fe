export type Role = {
  roleId: number;
  roleName: 'HEAD' | 'LEADER' | 'MATE' | 'Admin' | 'Assignee';
  roleType: 'TEAM' | 'PROJECT';
};
