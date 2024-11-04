import { deepFreeze } from '@utils/deepFreeze';
import type { RoleInfo } from '@/types/RoleType';

export const TEAM_ROLES = deepFreeze(['HEAD', 'LEADER', 'MATE'] as const);
export const PROJECT_ROLES = deepFreeze(['ADMIN', 'LEADER', 'ASSIGNEE'] as const);

export const PROJECT_DEFAULT_ROLE = 'ASSIGNEE';
export const TEAM_DEFAULT_ROLE = 'MATE';

export const TEAM_ROLE_INFO: RoleInfo[] = [
  {
    roleName: 'HEAD',
    label: 'HEAD',
    description: '팀의 모든 기능 가능',
  },
  {
    roleName: 'LEADER',
    label: 'LEADER',
    description: '팀 및 프로젝트 읽기 가능\n생성/수정/삭제의 경우 본인이 작성한것만 가능',
  },
  { roleName: 'MATE', label: 'Mate', description: '팀 조작 중 프로젝트 읽기 기능만 가능' },
];

export const PROJECT_ROLE_INFO: RoleInfo[] = [
  { roleName: 'ADMIN', label: 'ADMIN', description: '프로젝트 모든 권한 가능' },
  {
    roleName: 'LEADER',
    label: 'LEADER',
    description: `상태 및 일정 읽기 가능 \n생성/수정/삭제 가능`,
  },
  {
    roleName: 'ASSIGNEE',
    label: 'ASSIGNEE',
    description: '일정 읽기 가능\n생성/수정/삭제 본인이 작성한 것만 가능 ',
  },
];
