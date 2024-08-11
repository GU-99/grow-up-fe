import { useMemo } from 'react';
import { Navigate, NavLink, Outlet, useParams } from 'react-router-dom';
import useModal from '@hooks/useModal';
import ListSidebar from '@components/sidebar/ListSidebar';
import ListProject from '@components/sidebar/ListProject';
import CreateModalTask from '@components/modal/task/CreateModalTask';
import CreateModalProjectStatus from '@components/modal/project-status/CreateModalProjectStatus';
import { ProjectContext } from '@hooks/useProjectContext';
import { PROJECT_DUMMY } from '@mocks/mockData';
import { RiSettings5Fill } from 'react-icons/ri';

export default function ProjectLayout() {
  const { projectId } = useParams();
  const { showModal: showTaskModal, openModal: openTaskModal, closeModal: closeTaskModal } = useModal();
  const { showModal: showStatusModal, openModal: openStatusModal, closeModal: closeStatusModal } = useModal();
  const project = useMemo(
    () => PROJECT_DUMMY.find((project) => project.projectId.toString() === projectId),
    [projectId],
  );

  if (!project) return <Navigate to="/error" replace />;

  return (
    <>
      <section className="flex h-full p-15">
        <ListSidebar label="team" title="팀 이름...">
          <ListProject data={PROJECT_DUMMY} targetId={projectId} />
        </ListSidebar>
        <section className="flex w-2/3 flex-col border border-list bg-contents-box">
          <header className="flex h-30 items-center justify-between border-b p-10">
            {/* ToDo: LabelTitle 공통 컴포넌트로 추출할 것 */}
            <div>
              <small className="mr-5 font-bold text-category">project</small>
              <span className="text-emphasis">{project?.name}</span>
            </div>
            <div className="flex cursor-pointer items-center text-sm text-main">
              <RiSettings5Fill /> Project Setting
            </div>
          </header>
          <div className="flex grow flex-col overflow-auto p-10 pt-0">
            <div className="sticky top-0 z-10 mb-10 flex items-center justify-between border-b bg-contents-box pt-10">
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
                <button type="button" onClick={openTaskModal}>
                  + 할일 추가
                </button>
                <button type="button" onClick={openStatusModal}>
                  + 상태 추가
                </button>
              </div>
            </div>
            <Outlet context={{ project } satisfies ProjectContext} />
          </div>
        </section>
      </section>
      {showTaskModal && <CreateModalTask project={project} onClose={closeTaskModal} />}
      {showStatusModal && <CreateModalProjectStatus project={project} onClose={closeStatusModal} />}
    </>
  );
}
