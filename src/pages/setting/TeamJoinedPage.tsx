import Spinner from '@components/common/Spinner';
import { useLeaveTeam, useReadTeams } from '@hooks/query/useTeamQuery';

export default function JoinedTeamPage() {
  const { joinedTeamList, isLoading } = useReadTeams();
  const { mutate: leaveTeam } = useLeaveTeam();

  if (isLoading) return <Spinner />;

  return (
    <article className="h-full">
      {joinedTeamList && joinedTeamList.length > 0 ? (
        <ul className="min-w-300 space-y-2 text-sm">
          {joinedTeamList.map((team) => (
            <li key={team.teamId} className="flex h-50 items-center gap-4 border p-8">
              <div className="flex max-h-full grow gap-4">
                <div className="max-h-full w-50 shrink-0">
                  <small className="text-xs font-bold text-category">team</small>
                  <p className="truncate">{team.teamName}</p>
                </div>
                <div className="max-h-full w-50 shrink-0">
                  <small className="text-xs font-bold text-category">head</small>
                  <p className="truncate">{team.creator}</p>
                </div>
                <div className="max-h-full max-w-300 px-4">
                  <small className="text-xs font-bold text-category">desc</small>
                  <p className="truncate">{team.content}</p>
                </div>
              </div>
              <div className="w-45 shrink-0">
                {/* TODO: 삭제하기 (creatorId와 로그인한 유저 아이디와 동일시에만 보임) */}
                <button
                  type="button"
                  className="rounded-md bg-red-500 px-5 py-2 text-sm text-white hover:brightness-90"
                  onClick={() => leaveTeam(String(team.teamId))}
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
  );
}
