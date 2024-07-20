import { useMemo } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import useModal from '@hooks/useModal';
import ListSidebar from '@components/sidebar/ListSidebar';
import ListProject from '@components/sidebar/ListProject';
import CreateModalProjectStatus from '@components/modal/project-status/CreateModalProjectStatus';
import { PROJECT_DUMMY } from '@mocks/mockData';
import { RiSettings5Fill } from 'react-icons/ri';

export default function ProjectLayout() {
  const { projectId } = useParams();
  const { showModal, openModal, closeModal } = useModal();
  const target = useMemo(
    () => PROJECT_DUMMY.find((project) => project.projectId.toString() === projectId),
    [projectId],
  );

  return (
    <>
      <section className="flex h-full p-15">
        <ListSidebar label="team" title="팀 이름...">
          <ListProject data={PROJECT_DUMMY} targetId={projectId} />
        </ListSidebar>
        <section className="flex w-2/3 flex-col border border-list bg-contents-box">
          <header className="flex h-30 items-center justify-between border-b p-10">
            <div>
              <small className="mr-5 font-bold text-category">project</small>
              <span className="text-emphasis">{target?.name}</span>
            </div>
            <div className="flex cursor-pointer items-center text-sm text-main">
              <RiSettings5Fill /> Project Setting
            </div>
          </header>
          <div className="flex grow flex-col overflow-auto p-10 pt-0">
            <div className="sticky top-0 z-10 mb-10 flex items-center justify-between border-b bg-contents-box pt-10">
              <ul className="*:mr-15">
                <li className="inline">
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
              <div className="text-main">
                <button type="button" onClick={openModal}>
                  <small>+</small> New State
                </button>
              </div>
            </div>
            <Outlet />
          </div>
        </section>
      </section>
      {showModal && <CreateModalProjectStatus onClose={closeModal} />}
    </>
  );
}
