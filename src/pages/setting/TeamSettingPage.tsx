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
      </div>

      <div className="mt-6 px-10">
        {/* 가입현황 레이아웃 */}
        {view === TeamStatus.JOINED && (
          <div>
            <ul>
              {joinedTeamList?.map((team) => (
                <li key={team.teamId} className="mb-2 flex items-center border p-4">
                  <div className="flex flex-shrink-0 basis-2/12 items-center">
                    <span className="mr-4 items-center text-xs font-bold text-main">team</span>
                    {team.name}
                  </div>
                  <div className="mx-8 max-h-60 flex-grow overflow-auto scrollbar-hide">{team.content}</div>
                  <div className="flex flex-shrink-0 items-center">
                    <button className="rounded-md bg-error p-2 text-white hover:brightness-90" type="button">
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
            <ul>
              {invitedTeamList?.map((invite) => (
                <li key={invite.teamId} className="mb-2 flex items-center border p-4">
                  <div className="flex-shrink-0 basis-2/12">
                    <span className="mr-4 text-xs font-bold text-main">team</span>
                    {invite.name}
                  </div>
                  <div className="mr-8 max-h-60 flex-grow overflow-auto scrollbar-hide">{invite.content}</div>
                  <div className="flex flex-shrink-0 space-x-6">
                    <button className="rounded-md bg-main p-2 text-white hover:brightness-90" type="button">
                      수락하기
                    </button>
                    <button className="rounded-md bg-error p-2 text-white hover:brightness-90" type="button">
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
