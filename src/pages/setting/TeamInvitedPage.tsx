import Meta from '@components/common/Meta';
import Spinner from '@components/common/Spinner';
import { useApproveTeamInvitation, useRejectTeamInvitation, useReadTeams } from '@hooks/query/useTeamQuery';

export default function InvitedTeamPage() {
  const { invitedTeamList, isLoading } = useReadTeams();
  const { mutate: ApproveInvitation } = useApproveTeamInvitation();
  const { mutate: RejectInvitation } = useRejectTeamInvitation();

  if (isLoading) return <Spinner />;

  return (
    <>
      <Meta title="Grow Up : 팀 대기 현황" />
      <article className="h-full" aria-label="초대된 팀 목록">
        {invitedTeamList && invitedTeamList.length > 0 ? (
          <div className="relative h-full">
            <ul className="h-full overflow-y-auto">
              {invitedTeamList.map((invite) => (
                <li
                  key={invite.teamId}
                  className="flex min-w-fit items-center gap-4 border-b border-gray-200 p-8"
                  aria-label="팀 초대 정보"
                >
                  <div className="flex grow gap-4">
                    <div className="w-64">
                      <small className="text-xs font-bold text-gray-500">팀</small>
                      <p className="truncate text-sm text-gray-800">{invite.teamName}</p>
                    </div>
                    <div className="w-64">
                      <small className="text-xs font-bold text-gray-500">팀장</small>
                      <p className="truncate text-sm text-gray-800">{invite.creator}</p>
                    </div>
                    <div className="w-380">
                      <small className="text-xs font-bold text-gray-500">소개</small>
                      <p className="truncate text-sm text-gray-800">{invite.content}</p>
                    </div>
                  </div>

                  <div className="flex w-50 shrink-0 flex-col gap-2">
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
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-gray-600">
            현재 가입 대기중인 팀이 없습니다! <br />
            팀에 가입해 보세요 😄
          </div>
        )}
      </article>
    </>
  );
}
