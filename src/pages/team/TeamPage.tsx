import { useParams } from 'react-router-dom';
import CreateModalProject from '@components/modal/project/CreateModalProject';
import { useStore } from '@stores/useStore';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import Meta from '@components/common/Meta';
import { useReadProjects } from '@hooks/query/useProjectQuery';
import { useReadTeamCoworkers, useReadTeams } from '@hooks/query/useTeamQuery';
import Spinner from '@components/common/Spinner';
import ProjectItemList from '@components/project/ProjectItemList';
import EmptyProjectItemList from '@components/project/EmptyProjectItemList';

export default function TeamPage() {
  const { showModal: showProjectModal, openModal: openProjectModal, closeModal: closeProjectModal } = useModal();
  const { teamId } = useParams();
  const {
    userInfo: { userId },
  } = useStore();
  const { toastWarn } = useToast();

  const { projectList, isProjectLoading } = useReadProjects(Number(teamId));
  const { joinedTeamList, isLoading: isTeamLoading } = useReadTeams();
  const { teamCoworkers } = useReadTeamCoworkers(Number(teamId));

  const team = joinedTeamList.find((team) => team.teamId.toString() === teamId);
  const userTeamRole = teamCoworkers.find((coworker) => coworker.userId === userId)?.roleName || null;
  const teamName = team ? team.teamName : '';

  const handleCreateProjectClick = () => {
    if (!teamId) return toastWarn('팀을 선택한 후 프로젝트 생성을 진행해주세요.');

    if (userTeamRole !== 'HEAD' && userTeamRole !== 'LEADER') {
      return toastWarn('프로젝트 생성 권한이 없습니다.');
    }

    openProjectModal();
  };

  if (isProjectLoading || isTeamLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Meta title="Grow Up : 팀 관리" />
      <section className="flex h-full flex-col">
        <header className="flex justify-between border-b">
          <div className="flex h-30 items-center justify-center space-x-4 px-10">
            <small className="text-xs font-bold text-category">team</small>
            <span>{teamName}</span>
          </div>
          <button
            type="button"
            onClick={handleCreateProjectClick}
            aria-label="새 프로젝트 생성"
            className="mr-10 font-bold text-main hover:brightness-50"
          >
            + 프로젝트 생성
          </button>
        </header>

        <section className="h-full overflow-y-auto">
          {projectList.length > 0 ? (
            <ProjectItemList teamId={Number(teamId)} projectList={projectList} />
          ) : (
            <EmptyProjectItemList />
          )}
        </section>
        {showProjectModal && <CreateModalProject onClose={closeProjectModal} />}
      </section>
    </>
  );
}
