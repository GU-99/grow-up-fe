import { useStore } from '@stores/useStore';
import useToast from '@hooks/useToast';
import useTeamPermission from '@hooks/useTeamPermission';
import { useDeleteTeam, useLeaveTeam } from '@hooks/query/useTeamQuery';

import type { Team, TeamListWithApproval } from '@/types/TeamType';

type TeamItemProps = {
  team: TeamListWithApproval;
};

export default function TeamItem({ team }: TeamItemProps) {
  const { mutate: leaveTeam } = useLeaveTeam();
  const { mutate: deleteTeam } = useDeleteTeam();
  const { userInfo } = useStore();
  const { toastWarn } = useToast();
  const { hasTeamDeletePermission } = useTeamPermission(team.teamId);

  const handleDeleteClick = async (teamId: Team['teamId']) => {
    if (!hasTeamDeletePermission()) {
      return toastWarn('팀 삭제 권한이 없습니다.');
    }
    deleteTeam(teamId);
  };

  return (
    <li key={team.teamId} className="flex min-w-fit items-center gap-4 border-b p-8" aria-label="팀 이름">
      <div className="flex grow gap-4">
        <div className="w-60">
          <small className="text-xs font-bold text-category">team</small>
          <p className="truncate">{team.teamName}</p>
        </div>
        <div className="w-60">
          <small className="text-xs font-bold text-category">head</small>
          <p className="truncate">{team.creator}</p>
        </div>
        <div className="w-180 grow">
          <small className="text-xs font-bold text-category">desc</small>
          <p className="truncate">{team.content}</p>
        </div>
      </div>

      <div className="mx-4 flex w-45 shrink-0 flex-col gap-4">
        {team.creatorId === userInfo.userId && (
          <button
            type="button"
            className="rounded-md bg-red-500 px-5 py-2 text-sm text-white hover:brightness-90"
            onClick={() => handleDeleteClick(team.teamId)}
          >
            삭제하기
          </button>
        )}
        <button
          type="button"
          className="rounded-md bg-red-500 px-5 py-2 text-sm text-white hover:brightness-90"
          onClick={() => leaveTeam(team.teamId)}
        >
          탈퇴하기
        </button>
      </div>
    </li>
  );
}
