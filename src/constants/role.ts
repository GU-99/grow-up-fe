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
    description: '팀의 모든 기능을 사용할 수 있습니다.\n권한 관리, 팀원 초대 및 추방\n팀과 프로젝트 설정 및 관리 등',
  },
  {
    roleName: 'LEADER',
    label: 'LEADER',
    description: '팀과 프로젝트의 내용을 볼 수 있으며,\n본인이 작성한 항목은 추가, 수정, 삭제가 가능합니다.',
  },
  {
    roleName: 'MATE',
    label: 'Mate',
    description: '팀에서 프로젝트의 내용을 읽을 수 있습니다.\n추가, 수정, 삭제는 불가능합니다.',
  },
];

export const PROJECT_ROLE_INFO: RoleInfo[] = [
  {
    roleName: 'ADMIN',
    label: 'ADMIN',
    description:
      '프로젝트의 모든 기능을 사용할 수 있습니다.\n권한 관리, 프로젝트 멤버 초대 및 제거\n상태 및 일정 관리 등',
  },
  {
    roleName: 'LEADER',
    label: 'LEADER',
    description: '프로젝트의 상태 및 일정을 보고\n상태 및 일정을 추가하거나 수정, 삭제할 수 있습니다.',
  },
  {
    roleName: 'ASSIGNEE',
    label: 'ASSIGNEE',
    description: '프로젝트 일정을 보고\n일정 추가, 수정 및 삭제가 가능합니다.',
  },
];
