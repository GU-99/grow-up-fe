import { useEffect, useState } from 'react';
import useAxios from '@/hooks/useAxios';
import { findTeamList } from '@/services/userService';

enum TeamStatus {
  JOINED,
  INVITED,
}

export default function TeamSettingPage() {
  const [view, setView] = useState<TeamStatus>(TeamStatus.JOINED);

  // ToDo: useAxios 부분을 react query로 변경할 것
  const { data, loading, fetchData } = useAxios(findTeamList);
  const joinedTeamList = data?.filter((data) => data.isPendingApproval === true);
  const invitedTeamList = data?.filter((data) => data.isPendingApproval === false);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main>
      <section className="mt-10 space-x-4 border-b-2 px-10">
        <button
          type="button"
          onClick={() => setView(TeamStatus.JOINED)}
          className={view === TeamStatus.JOINED ? 'text-main' : 'text-emphasis'}
        >
          가입현황
        </button>
        <button
          type="button"
          onClick={() => setView(TeamStatus.INVITED)}
          className={view === TeamStatus.INVITED ? 'text-main' : 'text-emphasis'}
        >
          대기현황
        </button>
      </section>

      <section className="mt-6 px-10">
        {/* 가입현황 레이아웃 */}
        {view === TeamStatus.JOINED && (
          <article>
            <ul className="min-w-300 space-y-2 text-sm">
              {joinedTeamList?.map((team) => (
                <li key={team.teamId} className="flex h-50 items-center gap-4 border p-8">
                  <div className="flex max-h-full flex-grow gap-4">
                    <div className="max-h-full w-50 shrink-0">
                      <small className="flex flex-col text-xs font-bold text-main">team</small>
                      <p className="truncate">{team.name}</p>
                    </div>

                    <div className="flex max-h-full w-50 shrink-0 flex-col">
                      <small className="h-10 text-xs font-bold text-main">head</small>
                      <p className="truncate">{team.creator}</p>
                    </div>

                    <div className="flex max-h-full max-w-300 flex-col px-4">
                      <small className="text-xs font-bold text-main">desc</small>
                      <p className="truncate">{team.content}</p>
                    </div>
                  </div>

                  <div className="w-45 shrink-0">
                    <button
                      type="button"
                      className="rounded-md bg-red-500 px-5 py-2 text-sm text-white hover:brightness-90"
                    >
                      탈퇴하기
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        )}
        {/* 대기현황 레이아웃 */}
        {view === TeamStatus.INVITED && (
          <article>
            <ul className="min-w-300 space-y-2 text-sm">
              {invitedTeamList?.map((invite) => (
                <li key={invite.teamId} className="flex h-50 items-center gap-4 border p-8">
                  <div className="flex max-h-full flex-grow gap-4">
                    <div className="max-h-full w-50 shrink-0">
                      <small className="flex flex-col text-xs font-bold text-main">team</small>
                      <p className="truncate">{invite.name}</p>
                    </div>

                    <div className="flex max-h-full w-50 shrink-0 flex-col">
                      <small className="h-10 text-xs font-bold text-main">head</small>
                      <p className="truncate">{invite.creator}</p>
                    </div>

                    <div className="flex max-h-full max-w-300 flex-col px-4">
                      <small className="text-xs font-bold text-main">desc</small>
                      <p className="truncate">{invite.content}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-4">
                    <button
                      type="button"
                      className="rounded-md bg-main px-5 py-2 text-sm text-white hover:brightness-90"
                    >
                      수락하기
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-red-500 px-5 py-2 text-sm text-white hover:brightness-90"
                    >
                      거부하기
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        )}
      </section>
    </main>
  );
}
