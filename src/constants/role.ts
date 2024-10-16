import { deepFreeze } from '@utils/deepFreeze';
import type { RoleInfo } from '@/types/RoleType';

export const TEAM_ROLES = deepFreeze(['HEAD', 'LEADER', 'MATE'] as const);
export const PROJECT_ROLES = deepFreeze(['ADMIN', 'LEADER', 'ASSIGNEE'] as const);

export const TEAM_ROLE_INFO: RoleInfo[] = [
  { roleName: 'HEAD', label: 'HEAD', description: '모든 권한 가능' },
  {
    roleName: 'LEADER',
    label: 'LEADER',
    description: '팀원 탈퇴(Mate만)\n프로젝트 생성 권한\n프로젝트 삭제(본인이 생성한 것만)',
  },
  { roleName: 'MATE', label: 'Mate', description: '프로젝트 읽기만 가능, 수정 및 생성 불가' },
];

export const PROJECT_ROLE_INFO: RoleInfo[] = [
  { roleName: 'ADMIN', label: 'ADMIN', description: '프로젝트 모든 권한 가능' },
  {
    roleName: 'LEADER',
    label: 'LEADER',
    description: '상태 및 일정 생성 권한\n수행자 할당 가능\n',
  },
  { roleName: 'MATE', label: 'MATE', description: '일정 쓰기\n일정 삭제(본인 것만) ' },
];
