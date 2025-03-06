import { useMemo } from 'react';
import { Navigate, NavLink, Outlet, useParams } from 'react-router-dom';
import { RiSettings5Fill } from 'react-icons/ri';
import { PROJECT_ROLES_PRIORITY } from '@constants/role';
import hasPermission from '@utils/permissionChecker';
import useStore from '@stores/useStore';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { ProjectContext } from '@hooks/useProjectContext';
import { useReadTeamInfo } from '@hooks/query/useTeamQuery';
import { useReadStatuses } from '@hooks/query/useStatusQuery';
import { useReadProjectCoworkers, useReadProjects } from '@hooks/query/useProjectQuery';
import Spinner from '@components/common/Spinner';
import ListSidebar from '@components/sidebar/ListSidebar';
import ListProject from '@components/sidebar/ListProject';
import CreateModalTask from '@components/modal/task/CreateModalTask';
import UpdateModalProject from '@components/modal/project/UpdateModalProject';
import CreateModalProjectStatus from '@components/modal/project-status/CreateModalProjectStatus';
import type { ProjectRoles } from '@/types/RoleType';

export default function ProjectLayout() {
  const { teamId, projectId } = useParams();
  const { teamInfo } = useReadTeamInfo(Number(teamId));
  const { projectList, isProjectLoading } = useReadProjects(Number(teamId));

  const { statusList, isStatusesLoading } = useReadStatuses(Number(projectId));
  const { projectCoworkers, isProjectCoworkersLoading } = useReadProjectCoworkers(Number(projectId));
  const { showModal: showTaskModal, openModal: openTaskModal, closeModal: closeTaskModal } = useModal();
  const { showModal: showStatusModal, openModal: openStatusModal, closeModal: closeStatusModal } = useModal();
  const { showModal: showProjectModal, openModal: openProjectModal, closeModal: closeProjectModal } = useModal();
  const { toastWarn } = useToast();

  const { userInfo } = useStore();
  const project = useMemo(
    () => projectList?.find((project) => project.projectId === Number(projectId)),
    [projectList, projectId],
  );
  const projectUser = projectCoworkers.find((coworker) => coworker.userId === userInfo.userId);

  if (isProjectLoading || isProjectCoworkersLoading || isStatusesLoading) return <Spinner />;
  if (!teamInfo) return <Navigate to="/error" replace />;
  if (!project) return <Navigate to="/error" replace />;

  const handleCreateTaskClick = () => {
    if (statusList.length === 0) {
      return toastWarn('등록된 프로젝트 상태가 없습니다. 상태를 등록한 이후에 다시 시도해주세요.');
    }
    openTaskModal();
  };

  // ToDo: 권한 확인하는 로직을 한 곳으로 모은 hook을 만들 것.
  const handleUpdateProjectClick = () => {
    if (!projectUser) return toastWarn('유저 권한을 확인할 수 없습니다.');
    if (!hasPermission<ProjectRoles>(PROJECT_ROLES_PRIORITY, 'ADMIN', projectUser.roleName)) {
      return toastWarn('프로젝트 수정 권한이 없습니다.');
    }
    openProjectModal();
  };

  return (
    <>
      <section className="flex h-full gap-10 p-15">
        <ListSidebar label="team" title={teamInfo.teamName}>
          <ListProject data={projectList} targetId={projectId} />
        </ListSidebar>
        <section className="flex w-2/3 grow flex-col border border-list bg-contents-box">
          <header className="flex h-30 items-center justify-between border-b p-10">
            {/* ToDo: LabelTitle 공통 컴포넌트로 추출할 것 */}
            <div>
              <small className="mr-5 font-bold text-category">project</small>
              <span className="text-emphasis">{project?.projectName}</span>
            </div>
            <button
              type="button"
              className="flex cursor-pointer items-center text-sm text-main"
              onClick={handleUpdateProjectClick}
            >
              <RiSettings5Fill /> Project Setting
            </button>
          </header>
          <div className="flex grow flex-col overflow-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-contents-box p-10 pb-0">
              <ul className="*:mr-15">
                <li className="inline">
                  {/* ToDo: nav 옵션사항을 정리하여 map으로 정리할 것 */}
                  <NavLink to="calendar" className={({ isActive }) => (isActive ? 'text-main' : 'text-emphasis')}>
                    Calendar
                  </NavLink>
                </li>
                <li className="inline">
                  <NavLink to="kanban" className={({ isActive }) => (isActive ? 'text-main' : 'text-emphasis')}>
                    Kanban
                  </NavLink>
                </li>
              </ul>
              <div className="text-main *:ml-10">
                <button type="button" className="outline-none" onClick={handleCreateTaskClick}>
                  + 할일 추가
                </button>
                <button type="button" className="outline-none" onClick={openStatusModal}>
                  + 상태 추가
                </button>
              </div>
            </div>
            <div className="flex grow overflow-auto p-10">
              <Outlet context={{ project, projectCoworkers } satisfies ProjectContext} />
            </div>
          </div>
        </section>
      </section>
      {showTaskModal && <CreateModalTask project={project} onClose={closeTaskModal} />}
      {showStatusModal && <CreateModalProjectStatus project={project} onClose={closeStatusModal} />}
      {showProjectModal && <UpdateModalProject projectId={project.projectId} onClose={closeProjectModal} />}
    </>
  );
}
