import { IoIosSettings } from 'react-icons/io';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import CreateModalProject from '@components/modal/project/CreateModalProject';
import useModal from '@hooks/useModal';
import UpdateModalProject from '@components/modal/project/UpdateModalProject';
import { useReadProjects } from '@hooks/query/useProjectQuery';
import Spinner from '@components/common/Spinner';
import { useReadTeams } from '@hooks/query/useTeamQuery';
import type { Project } from '@/types/ProjectType';

export default function TeamPage() {
  const { showModal: showProjectModal, openModal: openProjectModal, closeModal: closeProjectModal } = useModal();
  const { showModal: showUpdateModal, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();
  const { teamId } = useParams();
  const { projectList: teamProjects, isProjectLoading } = useReadProjects(Number(teamId));
  const { joinedTeamList } = useReadTeams();
  const [selectedProjectId, setSelectedProjectId] = useState<Project['projectId'] | null>(null);

  const team = joinedTeamList.find((team) => team.teamId.toString() === teamId);
  const teamName = team ? team.teamName : '';

  const handleOpenUpdateModal = (projectId: Project['projectId']) => {
    setSelectedProjectId(projectId);
    openUpdateModal();
  };

  if (isProjectLoading) {
    <Spinner />;
  }

  return (
    <section className="flex h-full flex-col">
      <header className="flex justify-between border-b">
        <div className="flex h-30 items-center justify-center space-x-4 px-10">
          <small className="text-xs font-bold text-category">team</small>
          <span>{teamName}</span>
        </div>
        <button type="button" onClick={openProjectModal} className="hover:brightness-70 text-section mr-10">
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

                    {/* ToDo: 프로젝트 삭제 기능 */}
                    <button
                      className="hover:brightness-200"
                      type="button"
                      aria-label="Delete"
                      onClick={(e) => e.preventDefault()}
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
