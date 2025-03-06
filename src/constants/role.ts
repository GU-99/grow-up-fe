import type { ProjectRoles, RoleInfo, TeamRoles } from '@/types/RoleType';

export const TEAM_ROLES_PRIORITY = {
  HEAD: 3,
  LEADER: 2,
  MATE: 1,
};

export const PROJECT_ROLES_PRIORITY = {
  ADMIN: 3,
  LEADER: 2,
  ASSIGNEE: 1,
};

export const TEAM_ROLES = Object.keys(TEAM_ROLES_PRIORITY) as TeamRoles[];
export const TEAM_CREATE_ROLES = TEAM_ROLES.filter((role) => role !== 'HEAD');
export const PROJECT_ROLES = Object.keys(PROJECT_ROLES_PRIORITY) as ProjectRoles[];

export const PROJECT_DEFAULT_ROLE = 'ASSIGNEE';
export const TEAM_DEFAULT_ROLE = 'MATE';

export const TEAM_ROLES_MAP = {
  HEAD: 'HEAD',
  LEADER: 'LEADER',
  MATE: 'MATE',
} as const;

export const PROJECT_ROLES_MAP = {
  ADMIN: 'ADMIN',
  LEADER: 'LEADER',
  ASSIGNEE: 'ASSIGNEE',
} as const;

export const REQUIRED_PERMISSION = {
  TEAM_UPDATE: TEAM_ROLES_MAP.HEAD,
  TEAM_DELETE: TEAM_ROLES_MAP.HEAD,
  TEAM_COWORKER_INVITE: TEAM_ROLES_MAP.HEAD,
  TEAM_COWORKER_UPDATE: TEAM_ROLES_MAP.HEAD,
  TEAM_COWORKER_KICK: TEAM_ROLES_MAP.HEAD,
  TEAM_PROJECT_CREATE: TEAM_ROLES_MAP.LEADER,
  PROJECT_UPDATE: PROJECT_ROLES_MAP.ADMIN,
  PROJECT_DELETE: PROJECT_ROLES_MAP.ADMIN,
  PROJECT_COWORKER_INVITE: PROJECT_ROLES_MAP.ADMIN,
  PROJECT_COWORKER_UPDATE: PROJECT_ROLES_MAP.ADMIN,
  PROJECT_COWORKER_KICK: PROJECT_ROLES_MAP.ADMIN,
  PROJECT_STATUS_CREATE: PROJECT_ROLES_MAP.LEADER,
  PROJECT_STATUS_UPDATE: PROJECT_ROLES_MAP.LEADER,
  PROJECT_STATUS_DELETE: PROJECT_ROLES_MAP.LEADER,
  PROJECT_TASK_CREATE: PROJECT_ROLES_MAP.ASSIGNEE,
  PROJECT_TASK_UPDATE: PROJECT_ROLES_MAP.ASSIGNEE,
  PROJECT_TASK_DELETE: PROJECT_ROLES_MAP.ASSIGNEE,
};

export const TEAM_ROLE_INFO: RoleInfo[] = [
  {
    roleName: 'HEAD',
    label: 'HEAD',
    description: '- 팀: 수정 | 삭제\n- 팀원: 초대 | 추방\n- 프로젝트: 생성 | 수정 | 삭제\n- 모든 프로젝트의 ADMIN 권한',
  },
  {
    roleName: 'LEADER',
    label: 'LEADER',
    description: '- 프로젝트: 생성 | 수정 | 삭제',
  },
  {
    roleName: 'MATE',
    label: 'Mate',
    description: '- 팀: 읽기만 가능',
  },
];

export const PROJECT_ROLE_INFO: RoleInfo[] = [
  {
    roleName: 'ADMIN',
    label: 'ADMIN',
    description:
      '- 프로젝트: 수정 | 삭제\n- 프로젝트원: 초대 | 추방\n- 상태: 생성 | 수정 | 삭제\n- 일정: 생성 | 수정 | 삭제',
  },
  {
    roleName: 'LEADER',
    label: 'LEADER',
    description: '- 상태: 생성 | 수정 | 삭제\n- 일정: 생성 | 수정 | 삭제',
  },
  {
    roleName: 'ASSIGNEE',
    label: 'ASSIGNEE',
    description: '- 일정: 생성 | 수정 | 삭제',
  },
];
