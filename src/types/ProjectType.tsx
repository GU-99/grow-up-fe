import type { User } from '@/types/UserType';
import type { ProjectRoleName } from '@/types/RoleType';

// ToDo: API 설계 완료시 데이터 타입 변경할 것
export type Project = {
  projectId: number;
  teamId: number;
  projectName: string;
  content: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type ProjectCoworker = {
  userId: User['userId'];
  roleName: ProjectRoleName;
  nickname?: string;
};

export type ProjectCoworkerInfo = ProjectCoworker & { nickname: User['nickname'] };

export type ProjectForm = Omit<Project, 'projectId' | 'teamId'> & {
  coworkers: ProjectCoworker[];
};
