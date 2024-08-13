import { IoIosSettings } from 'react-icons/io';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PROJECT_DUMMY, TEAM_DUMMY } from '@/mocks/mockData';
import CreateModalProject from '@/components/modal/project/CreateModalProject';
import useModal from '@/hooks/useModal';
import UpdateModalProject from '@/components/modal/project/UpdateModalProject';
import type { Project } from '@/types/ProjectType';

export default function TeamPage() {
  const { showModal: showProjectModal, openModal: openProjectModal, closeModal: closeProjectModal } = useModal();
  const { showModal: showUpdateModal, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();
  const { teamId } = useParams();
  const [teamProjects, setTeamProjects] = useState<Project[]>([]);
  const [teamName, setTeamName] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<Project['projectId'] | null>(null);

  // ToDo:  react-query로 대체
  useEffect(() => {
    const projects = PROJECT_DUMMY.filter((project) => project.teamId.toString() === teamId);
    setTeamProjects(projects);

    const team = TEAM_DUMMY.find((team) => team.teamId.toString() === teamId);
    if (team) {
      setTeamName(team.name);
    }
  }, [teamId]);

  const handleOpenUpdateModal = (projectId: Project['projectId']) => {
    setSelectedProjectId(projectId);
    openUpdateModal();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between border-b">
        <div className="flex h-30 items-center justify-center space-x-4 px-10">
          <small className="text-xs font-bold text-main">Team</small>
          <span> {teamName}</span>
        </div>
        <button type="button" onClick={openProjectModal} className="hover:brightness-70 mr-10 text-main">
          + 프로젝트 생성
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* ToDo: 컴포넌트 분리필요 */}
        {teamProjects.length > 0 ? (
          <ul>
            {teamProjects.map((project) => (
              <li key={project.projectId} className="border-b border-opacity-95">
                <Link to={`/teams/${teamId}/projects/${project.projectId}`} className="flex h-40 items-center">
                  <div className="flex h-30 basis-3/12 flex-col justify-center px-10">
                    <small className="font-bold text-category">Project</small>
                    <span>{project.name}</span>
                  </div>
                  <div className="flex h-30 basis-8/12 flex-col justify-center px-10">
                    <small className="font-bold text-category">desc</small>
                    <span>{project.content}</span>
                  </div>
                  <div className="mr-6 flex basis-1/12 space-x-10">
                    <button
                      className="flex items-center text-main"
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
                    <button type="button" aria-label="Delete" onClick={(e) => e.preventDefault()}>
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
      </div>
      {showProjectModal && <CreateModalProject onClose={closeProjectModal} />}
      {showUpdateModal && selectedProjectId && (
        <UpdateModalProject projectId={selectedProjectId} onClose={closeUpdateModal} />
      )}
    </div>
  );
}
