import { deepFreeze } from '@utils/deepFreeze';
import type { RoleInfo } from '@/types/RoleType';

export const TEAM_ROLES = deepFreeze(['HEAD', 'LEADER', 'MATE'] as const);
export const TEAM_CREATE_ROLES = deepFreeze(['LEADER', 'MATE'] as const);
export const PROJECT_ROLES = deepFreeze(['ADMIN', 'LEADER', 'ASSIGNEE'] as const);

export const PROJECT_DEFAULT_ROLE = 'ASSIGNEE';
export const TEAM_DEFAULT_ROLE = 'MATE';

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
