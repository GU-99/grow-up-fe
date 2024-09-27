import { deepFreeze } from '@/utils/deepFreeze';

export const TEAM_ROLES = deepFreeze([
  { value: 'HEAD', label: 'HEAD' } as const,
  { value: 'LEADER', label: 'Leader' } as const,
  { value: 'MATE', label: 'Mate' } as const,
]);
