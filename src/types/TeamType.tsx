import { Role } from './RoleType';

// ToDo: API 설계 완료시 데이터 타입 변경할 것
export type Team = {
  teamId: number;
  creatorId: number;
  name: string;
  content: string;
};

export type TeamListWithApproval = Team & Pick<Role, 'roleName'> & { isPendingApproval: boolean };
