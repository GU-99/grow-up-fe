import { Role } from './RoleType';
import { User } from './UserType';

export type Team = {
  teamId: number;
  creatorId: number;
  teamName: string;
  content: string;
};

export type Coworker = {
  userId: User['userId'];
  roleName: 'HEAD' | 'LEADER' | 'MATE';
};

export type TeamForm = Omit<Team, 'teamId' | 'creatorId'> & { coworkers: Coworker[] };

export type TeamListWithApproval = Omit<Team, 'creatorId'> &
  Pick<Role, 'roleName'> & {
    isPendingApproval: boolean;
    creator: string;
    creatorId: number;
  };
