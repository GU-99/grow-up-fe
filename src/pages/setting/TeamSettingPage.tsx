import { useState } from 'react';
import { TEAM_DUMMY, TEAM_INVITATION_DUMMY } from '@/mocks/mockData';

export default function TeamSettingPage() {
  const [view, setView] = useState<'joined' | 'invited'>('joined');

  return (
    <div>
      <div>
        <div className="mt-10 space-x-4 border-b-2 py-4">
          <button type="button" onClick={() => setView('joined')} className={view === 'joined' ? 'font-bold' : ''}>
            가입현황
          </button>
          <button type="button" onClick={() => setView('invited')} className={view === 'invited' ? 'font-bold' : ''}>
            대기현황
          </button>
        </div>
      </div>

      <div className="mt-6 px-10">
        {/* 가입현황 layout */}
        {view === 'joined' && (
          <div>
            <ul>
              {TEAM_DUMMY.map((team) => (
                <li key={team.teamId} className="mb-2 flex border p-4">
                  <div className="basis-3/12">
                    <span className="mr-4 text-xs font-bold text-main">team</span>
                    {team.name}
                  </div>
                  <div className="mr-8 max-h-60 basis-8/12 overflow-auto scrollbar-hide">{team.content}</div>
                  {/* ToDo:탈퇴하기 기능 추가 */}
                  <button
                    className="basis-1/12 rounded-md bg-gray-100 p-2 hover:bg-error hover:text-white"
                    type="button"
                  >
                    탈퇴하기
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* 대기현황 layout */}
        {view === 'invited' && (
          <div>
            <ul>
              {TEAM_INVITATION_DUMMY.map((invite) => (
                <li key={invite.teamId} className="mb-2 flex items-center border p-4">
                  <div className="basis-3/12">
                    <span className="mr-4 text-xs font-bold text-main">team</span>
                    {invite.name}
                  </div>
                  <div className="mr-8 max-h-60 basis-10/12 overflow-auto scrollbar-hide">{invite.content}</div>
                  <div className="flex basis-3/12 space-x-6">
                    {/* ToDo: 수락하기 , 거부하기 기능 추가 */}
                    <button className="rounded-md bg-gray-100 p-2 hover:bg-main hover:text-white" type="button">
                      수락하기
                    </button>
                    <button className="rounded-md bg-gray-100 p-2 hover:bg-error hover:text-white" type="button">
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
