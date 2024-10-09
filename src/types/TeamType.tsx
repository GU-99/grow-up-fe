import type { User } from '@/types/UserType';
import type { Role, TeamRoleName } from '@/types/RoleType';

export type Team = {
  teamId: number;
  creatorId: number;
  teamName: string;
  content: string;
};

export type TeamCoworker = {
  userId: User['userId'];
  roleName: TeamRoleName;
  nickname?: string;
};
export type TeamUpdateInfo = Pick<Team, 'teamName' | 'content'>;

export type TeamCoworkerInfo = TeamCoworker & { nickname: User['nickname'] };

export type TeamForm = Omit<Team, 'teamId' | 'creatorId'> & { coworkers: TeamCoworker[] };

export type TeamListWithApproval = Omit<Team, 'creatorId'> &
  Pick<Role, 'roleName'> & {
    isPendingApproval: boolean;
    creator: string;
    creatorId: number;
  };
