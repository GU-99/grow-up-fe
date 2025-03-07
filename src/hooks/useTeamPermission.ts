import useStore from '@stores/useStore';
import useToast from '@hooks/useToast';
import { useReadTeamCoworkers } from '@hooks/query/useTeamQuery';
import hasPermission from '@utils/permissionChecker';
import { REQUIRED_PERMISSION, TEAM_ROLES_PRIORITY } from '@constants/role';

import type { Team } from '@/types/TeamType';
import type { TeamRoles } from '@/types/RoleType';

export default function useTeamPermission(teamId: Team['teamId']) {
  const { teamCoworkers } = useReadTeamCoworkers(teamId);
  const { toastWarn } = useToast();
  const { userInfo } = useStore();

  const currentTeamUser = teamCoworkers.find((coworker) => coworker.userId === userInfo.userId);

  const checkPermission = (requiredPermission: TeamRoles) => {
    if (!currentTeamUser) {
      toastWarn('팀에 소속되지 않았습니다.');
      return false;
    }
    return hasPermission<TeamRoles>(TEAM_ROLES_PRIORITY, requiredPermission, currentTeamUser.roleName);
  };

  return {
    hasTeamUpdatePermission: () => checkPermission(REQUIRED_PERMISSION.TEAM_UPDATE),
    hasTeamDeletePermission: () => checkPermission(REQUIRED_PERMISSION.TEAM_DELETE),
    hasTeamCoworkerInvitePermission: () => checkPermission(REQUIRED_PERMISSION.TEAM_COWORKER_INVITE),
    hasTeamCoworkerUpdatePermission: () => checkPermission(REQUIRED_PERMISSION.TEAM_COWORKER_UPDATE),
    hasTeamCoworkerKickPermission: () => checkPermission(REQUIRED_PERMISSION.TEAM_COWORKER_KICK),
    hasTeamProjectCreatePermission: () => checkPermission(REQUIRED_PERMISSION.TEAM_PROJECT_CREATE),
  };
}
