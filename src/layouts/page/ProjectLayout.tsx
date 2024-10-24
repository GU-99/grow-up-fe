import { useMemo } from 'react';
import { Navigate, NavLink, Outlet, useParams } from 'react-router-dom';
import { RiSettings5Fill } from 'react-icons/ri';
import useModal from '@hooks/useModal';
import { ProjectContext } from '@hooks/useProjectContext';
import { useReadProjectCoworkers, useReadProjects } from '@hooks/query/useProjectQuery';
import Spinner from '@components/common/Spinner';
import ListSidebar from '@components/sidebar/ListSidebar';
import ListProject from '@components/sidebar/ListProject';
import CreateModalTask from '@components/modal/task/CreateModalTask';
import CreateModalProjectStatus from '@components/modal/project-status/CreateModalProjectStatus';

export default function ProjectLayout() {
  const { teamId, projectId } = useParams();
  const { projectList, isProjectLoading } = useReadProjects(Number(teamId));
  const { projectCoworkers, isProjectCoworkersLoading } = useReadProjectCoworkers(Number(projectId));
  const { showModal: showTaskModal, openModal: openTaskModal, closeModal: closeTaskModal } = useModal();
  const { showModal: showStatusModal, openModal: openStatusModal, closeModal: closeStatusModal } = useModal();

  const project = useMemo(
    () => projectList?.find((project) => project.projectId.toString() === projectId),
    [projectList, projectId],
  );

  if (isProjectLoading || isProjectCoworkersLoading) return <Spinner />;
  if (!project) return <Navigate to="/error" replace />;

  return (
    <>
      <section className="flex h-full gap-10 p-15">
        <ListSidebar label="team" title="팀 이름...">
          <ListProject data={projectList} targetId={projectId} />
        </ListSidebar>
        <section className="flex w-2/3 grow flex-col border border-list bg-contents-box">
          <header className="flex h-30 items-center justify-between border-b p-10">
            {/* ToDo: LabelTitle 공통 컴포넌트로 추출할 것 */}
            <div>
              <small className="mr-5 font-bold text-category">project</small>
              <span className="text-emphasis">{project?.projectName}</span>
            </div>
            <div className="flex cursor-pointer items-center text-sm text-main">
              <RiSettings5Fill /> Project Setting
            </div>
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
                <button type="button" className="outline-none" onClick={openTaskModal}>
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
    </>
  );
}
