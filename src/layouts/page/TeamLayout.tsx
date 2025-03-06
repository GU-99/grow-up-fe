import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import ListSidebar from '@components/sidebar/ListSidebar';
import ListTeam from '@components/sidebar/ListTeam';
import CreateModalTeam from '@components/modal/team/CreateModalTeam';
import useModal from '@hooks/useModal';
import { useMemo } from 'react';
import { useReadTeams } from '@hooks/query/useTeamQuery';
import Spinner from '@components/common/Spinner';

export default function TeamLayout() {
  const location = useLocation();
  const { teamId } = useParams();
  const { showModal: showTeamModal, openModal: openTeamModal, closeModal: closeTeamModal } = useModal();
  const { joinedTeamList, isLoading: isTeamLoading } = useReadTeams();

  const selectedTeam = useMemo(
    () => joinedTeamList.find((team) => team.teamId.toString() === teamId),
    [teamId, joinedTeamList],
  );
  const hasProjectRoute = location.pathname.split('/').includes('projects');

  if (isTeamLoading) return <Spinner />;

  if (!selectedTeam && teamId) return <Navigate to="/error" replace />;

  if (hasProjectRoute) return <Outlet />;

  // ToDo: 팀 가입 목록이 없는 경우 UI 분리할 것
  return (
    <>
      <section className="flex h-full gap-10 p-15">
        <ListSidebar title="팀 목록" showButton text="팀 생성" onClick={openTeamModal}>
          <ListTeam data={joinedTeamList} targetId={teamId} />
        </ListSidebar>
        <section className="flex grow flex-col overflow-auto border border-list bg-contents-box">
          {joinedTeamList.length === 0 ? (
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
