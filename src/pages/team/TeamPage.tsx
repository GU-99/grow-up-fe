import { IoIosSettings } from 'react-icons/io';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import CreateModalProject from '@components/modal/project/CreateModalProject';
import useModal from '@hooks/useModal';
import UpdateModalProject from '@components/modal/project/UpdateModalProject';
import { useReadProjects, useDeleteProject, useReadProjectCoworkers } from '@hooks/query/useProjectQuery';
import Spinner from '@components/common/Spinner';
import { useReadTeamCoworkers, useReadTeams } from '@hooks/query/useTeamQuery';

import useToast from '@hooks/useToast';
import { useStore } from '@stores/useStore';
import type { Project } from '@/types/ProjectType';

export default function TeamPage() {
  const { showModal: showProjectModal, openModal: openProjectModal, closeModal: closeProjectModal } = useModal();
  const { showModal: showUpdateModal, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();
  const { teamId } = useParams();
  const { userInfo } = useStore();
  const { userId } = userInfo;
  const { coworkers: teamCoworkers } = useReadTeamCoworkers(Number(teamId));
  const { projectCoworkers } = useReadProjectCoworkers(Number(teamId));

  const { projectList: teamProjects, isProjectLoading } = useReadProjects(Number(teamId));
  const { joinedTeamList, isLoading: isTeamLoading } = useReadTeams();
  const [selectedProjectId, setSelectedProjectId] = useState<Project['projectId'] | null>(null);
  const { toastWarn, toastError } = useToast();

  const { mutate: deleteProjectMutate } = useDeleteProject(Number(teamId));

  const userTeamRole = teamCoworkers.find((coworker) => coworker.userId === userId)?.roleName || null;
  const userProjectRole = projectCoworkers.find((coworker) => coworker.userId === userId)?.roleName;
  const team = joinedTeamList.find((team) => team.teamId.toString() === teamId);
  const teamName = team ? team.teamName : '';

  const handleOpenUpdateModal = (projectId: Project['projectId']) => {
    if (userProjectRole !== 'ADMIN') {
      return toastError('프로젝트 수정 권한이 없습니다.');
    }

    setSelectedProjectId(projectId);
    openUpdateModal();
  };

  const handleCreateProjectClick = () => {
    if (!teamId) return toastWarn('팀을 선택한 후 프로젝트 생성을 진행해주세요.');

    if (userTeamRole !== 'HEAD' && userTeamRole !== 'LEADER') {
      toastError('프로젝트 생성 권한이 없습니다.');
      return;
    }

    openProjectModal();
  };

  const handleDeleteClick = (e: React.MouseEvent, projectId: Project['projectId']) => {
    e.preventDefault();
    deleteProjectMutate(projectId);
  };

  if (isProjectLoading || isTeamLoading) {
    return <Spinner />;
  }

  return (
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
        {/* ToDo: 컴포넌트 분리필요 */}
        {teamProjects.length > 0 ? (
          <ul>
            {teamProjects.map((project) => (
              <li key={project.projectId} className="min-w-300 space-y-2 text-sm">
                <Link
                  to={`/teams/${teamId}/projects/${project.projectId}`}
                  className="flex h-50 items-center border p-8"
                >
                  <div className="flex max-h-full grow">
                    <div className="max-h-full w-60 shrink-0">
                      <small className="flex flex-col text-xs font-bold text-category">project</small>
                      <p className="truncate">{project.projectName}</p>
                    </div>

                    <div className="flex max-h-full max-w-350 flex-col px-4">
                      <small className="text-xs font-bold text-category">desc</small>
                      <p className="truncate">{project.content}</p>
                    </div>
                  </div>

                  <div className="mr-6 flex shrink-0 space-x-10">
                    <button
                      className="flex items-center text-main hover:brightness-50"
                      aria-label="Settings"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenUpdateModal(project.projectId);
                      }}
                    >
                      <IoIosSettings size={20} className="mr-2" />
                      setting
                    </button>

                    <button
                      className="hover:brightness-200"
                      type="button"
                      aria-label="Delete"
                      onClick={(e) => handleDeleteClick(e, project.projectId)}
                    >
                      <FaRegTrashAlt size={20} />
                    </button>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-full items-center justify-center text-center">
            진행중인 프로젝트가 없습니다! <br />
            새로운 프로젝트를 생성해보세요 😄
          </div>
        )}
      </section>
      {showProjectModal && <CreateModalProject onClose={closeProjectModal} />}
      {showUpdateModal && selectedProjectId && (
        <UpdateModalProject projectId={selectedProjectId} onClose={closeUpdateModal} />
      )}
    </section>
  );
}
