import Spinner from '@components/common/Spinner';
import { useApproveTeamInvitation, useRejectTeamInvitation, useReadTeams } from '@hooks/query/useTeamQuery';

export default function InvitedTeamPage() {
  const { invitedTeamList, isLoading } = useReadTeams();
  const { mutate: ApproveInvitation } = useApproveTeamInvitation();
  const { mutate: RejectInvitation } = useRejectTeamInvitation();
  if (isLoading) return <Spinner />;

  return (
    <article className="h-full">
      {invitedTeamList && invitedTeamList.length > 0 ? (
        <ul className="min-w-300 space-y-2 text-sm">
          {invitedTeamList.map((invite) => (
            <li key={invite.teamId} className="flex h-50 items-center gap-4 border p-8">
              <div className="flex max-h-full grow gap-4">
                <div className="max-h-full w-50 shrink-0">
                  <small className="text-xs font-bold text-category">team</small>
                  <p className="truncate">{invite.teamName}</p>
                </div>
                <div className="max-h-full w-50 shrink-0">
                  <small className="h-10 text-xs font-bold text-category">head</small>
                  <p className="truncate">{invite.creator}</p>
                </div>
                <div className="max-h-full max-w-300 px-4">
                  <small className="text-xs font-bold text-category">desc</small>
                  <p className="truncate">{invite.content}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-4">
                <button
                  type="button"
                  className="rounded-md bg-main px-5 py-2 text-sm text-white hover:brightness-90"
                  onClick={() => ApproveInvitation(invite.teamId)}
                >
                  수락하기
                </button>
                <button
                  type="button"
                  className="rounded-md bg-red-500 px-5 py-2 text-sm text-white hover:brightness-90"
                  onClick={() => RejectInvitation(invite.teamId)}
                >
                  거부하기
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-full items-center justify-center text-center">
          현재 가입 대기중인 팀이 없습니다! <br />
          팀에 가입해 보세요 😄
        </div>
      )}
    </article>
  );
}
