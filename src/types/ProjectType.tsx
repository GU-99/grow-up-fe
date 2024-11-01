import type { User } from '@/types/UserType';
import type { ProjectRoleName } from '@/types/RoleType';

// ToDo: API 설계 완료시 데이터 타입 변경할 것
export type Project = {
  projectId: number;
  teamId: number;
  projectName: string;
  content: string;
  startDate: Date;
  endDate: Date | null;
};

export type ProjectCoworker = {
  userId: User['userId'];
  roleName: ProjectRoleName;
  nickname: string;
};

export type ProjectInfoForm = {
  projectName: string;
  content: string;
  startDate: string;
  endDate: string | null;
};

export type ProjectCoworkerForm = Omit<ProjectCoworker, 'nickname'>;

export type ProjectForm = ProjectInfoForm & {
  coworkers: ProjectCoworkerForm[];
};
