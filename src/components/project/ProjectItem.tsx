import { Link } from 'react-router-dom';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import useModal from '@hooks/useModal';
import { useDeleteProject, useDeleteProjectUser, useReadProjectCoworkers } from '@hooks/query/useProjectQuery';
import useStore from '@stores/useStore';
import UpdateModalProject from '@components/modal/project/UpdateModalProject';

import type { Team } from '@/types/TeamType';
import type { Project } from '@/types/ProjectType';
import useToast from '@/hooks/useToast';

type ProjectItemProps = {
  teamId: Team['teamId'];
  project: Project;
};

export default function ProjectItem({ teamId, project }: ProjectItemProps) {
  const { toastWarn } = useToast();
  const { showModal: showUpdateModal, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();
  const {
    userInfo: { userId },
  } = useStore();

  const { projectCoworkers } = useReadProjectCoworkers(project.projectId);
  const { mutate: deleteProjectMutate } = useDeleteProject(teamId);

  const userProjectRole = projectCoworkers.find((coworker) => coworker.userId === userId)?.roleName;

  const handleOpenUpdateModal = () => {
    if (userProjectRole !== 'ADMIN') return toastWarn('프로젝트 수정 권한이 없습니다.');
    openUpdateModal();
  };

  const handleDeleteClick = (projectId: Project['projectId']) => {
    if (userProjectRole !== 'ADMIN') return toastWarn('프로젝트 삭제 권한이 없습니다.');
    deleteProjectMutate(projectId);
  };

  return (
    <>
      <li key={project.projectId} className="min-w-300 space-y-2 text-sm">
        <Link to={`/teams/${teamId}/projects/${project.projectId}`} className="flex h-50 items-center border p-8">
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
              type="button"
              className="flex items-center text-main hover:brightness-50"
              aria-label="Settings"
              onClick={(e) => {
                e.preventDefault();
                handleOpenUpdateModal();
              }}
            >
              <IoIosSettings size={20} className="mr-2" />
              setting
            </button>

            <button
              type="button"
              className="hover:brightness-200"
              aria-label="Delete"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteClick(project.projectId);
              }}
            >
              <FaRegTrashAlt size={20} />
            </button>
          </div>
        </Link>
      </li>
      {showUpdateModal && project.projectId && (
        <UpdateModalProject projectId={project.projectId} onClose={closeUpdateModal} />
      )}
    </>
  );
}
