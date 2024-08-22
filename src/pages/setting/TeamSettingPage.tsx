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
    <div>
      <div className="mt-10 space-x-4 border-b-2 px-10">
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
      </div>

      <div className="mt-6 px-10">
        {/* 가입현황 레이아웃 */}
        {view === TeamStatus.JOINED && (
          <div>
            <ul className="min-w-300 space-y-2 text-sm">
              {joinedTeamList?.map((team) => (
                <li key={team.teamId} className="flex h-50 items-center gap-4 border p-8">
                  <div className="flex max-h-full gap-4">
                    <div className="max-h-full w-45 shrink-0">
                      <div className="text-xs font-bold text-main">team</div>
                      <div className="break-all">{team.name}</div>
                    </div>

                    <div className="flex max-h-full w-45 shrink-0 flex-col">
                      <div className="h-10 text-xs font-bold text-main">head</div>
                      <div className="grow overflow-y-auto break-all scrollbar-hide">{team.creator}</div>
                    </div>
                  </div>

                  <div className="flex h-full flex-grow items-center overflow-y-auto break-all px-4 scrollbar-hide">
                    <div className="max-h-full">{team.content}</div>
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
          </div>
        )}

        {/* 대기현황 레이아웃 */}
        {view === TeamStatus.INVITED && (
          <div>
            <ul className="min-w-300 space-y-2 text-sm">
              {invitedTeamList?.map((invite) => (
                <li key={invite.teamId} className="flex h-50 items-center gap-4 border p-8">
                  <div className="flex max-h-full gap-4">
                    <div className="max-h-full w-45 shrink-0">
                      <div className="text-xs font-bold text-main">team</div>
                      <div className="break-all">{invite.name}</div>
                    </div>

                    <div className="flex max-h-full w-45 shrink-0 flex-col">
                      <div className="h-10 text-xs font-bold text-main">head</div>
                      <div className="grow overflow-y-auto break-all scrollbar-hide">{invite.creator}</div>
                    </div>
                  </div>

                  <div className="flex h-full flex-grow items-center overflow-y-auto break-all px-4 scrollbar-hide">
                    <div className="max-h-full">{invite.content}</div>
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
          </div>
        )}
      </div>
    </div>
  );
}
