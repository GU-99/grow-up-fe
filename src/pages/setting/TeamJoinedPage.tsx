import Meta from '@components/common/Meta';
import Spinner from '@components/common/Spinner';
import { useDeleteTeam, useLeaveTeam, useReadTeams } from '@hooks/query/useTeamQuery';
import { useStore } from '@stores/useStore';

export default function JoinedTeamPage() {
  const { joinedTeamList, isLoading } = useReadTeams();
  const { mutate: leaveTeam } = useLeaveTeam();
  const { mutate: deleteTeam } = useDeleteTeam();
  const { userInfo } = useStore();
  if (isLoading) return <Spinner />;

  return (
    <>
      <Meta title="Grow Up : 팀 가입 현황" />
      <article className="h-full" aria-label="가입된 팀 목록">
        {joinedTeamList && joinedTeamList.length > 0 ? (
          <ul className="h-full overflow-y-auto">
            {joinedTeamList.map((team) => (
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
                      onClick={() => deleteTeam(team.teamId)}
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
            ))}
          </ul>
        ) : (
          <div className="flex h-full items-center justify-center text-center">
            현재 가입된 팀이 없습니다! <br />
            팀에 가입해 보세요 😄
          </div>
        )}
      </article>
    </>
  );
}
