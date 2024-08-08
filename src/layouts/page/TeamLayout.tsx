import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import ListSidebar from '@components/sidebar/ListSidebar';
import ListTeam from '@components/sidebar/ListTeam';
import CreateModalTeam from '@components/modal/team/CreateModalTeam';
import useModal from '@hooks/useModal';
import { TEAM_DUMMY } from '@mocks/mockData';
import { useMemo } from 'react';
import { Team } from '@/types/TeamType';

export default function TeamLayout() {
  const { showModal: showTeamModal, openModal: openTeamModal, closeModal: closeTeamModal } = useModal();
  const location = useLocation();
  const { teamId } = useParams();
  const teamData: Team[] = TEAM_DUMMY;
  const selectedTeam = useMemo(() => teamData.find((team) => team.teamId.toString() === teamId), [teamId, teamData]);
  const hasProjectRoute = location.pathname.split('/').includes('projects');

  if (!selectedTeam && teamId) return <Navigate to="/error" replace />;

  if (hasProjectRoute) return <Outlet />;

  return (
    <>
      <section className="flex h-full p-15">
        <ListSidebar title="팀 목록" isButton buttonText="팀 생성" onButtonClick={openTeamModal}>
          {/* ToDo: 사이드바 팀정보 추가 예정 */}
          <div />
        </ListSidebar>
        <section className="flex w-2/3 flex-col border border-list bg-contents-box">
          {teamData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              소속된 팀이 없습니다! <br />
              팀을 생성하여 다른 사람들과 함께 프로젝트를 관리해보세요 😄
            </div>
          ) : (
            <Outlet />
          )}
        </section>
      </section>
      {showTeamModal && <CreateModalTeam onClose={closeTeamModal} />}
    </>
  );
}
