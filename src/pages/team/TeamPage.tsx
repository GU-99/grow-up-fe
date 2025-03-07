import { useParams } from 'react-router-dom';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import useTeamPermission from '@hooks/useTeamPermission';
import { useReadTeams } from '@hooks/query/useTeamQuery';
import { useReadProjects } from '@hooks/query/useProjectQuery';
import Meta from '@components/common/Meta';
import Spinner from '@components/common/Spinner';
import ProjectItemList from '@components/project/ProjectItemList';
import EmptyProjectItemList from '@components/project/EmptyProjectItemList';
import CreateModalProject from '@components/modal/project/CreateModalProject';

export default function TeamPage() {
  const { showModal: showProjectModal, openModal: openProjectModal, closeModal: closeProjectModal } = useModal();
  const { teamId } = useParams();
  const { toastWarn } = useToast();
  const { hasTeamProjectCreatePermission } = useTeamPermission(Number(teamId));
  const { projectList, isProjectLoading } = useReadProjects(Number(teamId));
  const { joinedTeamList, isLoading: isTeamLoading } = useReadTeams();

  const team = joinedTeamList.find((team) => team.teamId.toString() === teamId);
  const teamName = team ? team.teamName : '';

  const handleCreateProjectClick = () => {
    if (!teamId) return toastWarn('팀을 선택한 후 프로젝트 생성을 진행해주세요.');
    if (!hasTeamProjectCreatePermission()) return toastWarn('프로젝트 생성 권한이 없습니다.');
    openProjectModal();
  };

  if (isProjectLoading || isTeamLoading) return <Spinner />;

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
            className="mr-10 font-bold text-main hover:brightness-50 focus-visible:outline-none"
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
