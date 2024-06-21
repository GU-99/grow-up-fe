import { useMemo } from 'react';
import { RiSettings5Fill } from 'react-icons/ri';
import { NavLink, Outlet, useParams } from 'react-router-dom';

import ListSidebar from '@components/sidebar/ListSidebar';
import ListProject from '@components/sidebar/ListProject';

const dummy = {
  teamName: '김찌와 소주',
  data: [
    { id: '1', title: '캘린더 만들기1' },
    { id: '2', title: '캘린더 만들기2' },
    { id: '3', title: '캘린더 만들기3' },
    { id: '4', title: '캘린더 만들기4' },
    { id: '5', title: '캘린더 만들기5' },
    { id: '6', title: '캘린더 만들기6' },
    { id: '7', title: '캘린더 만들기7' },
    { id: '8', title: '캘린더 만들기8' },
    { id: '9', title: '캘린더 만들기9' },
    { id: '10', title: '캘린더 만들기10' },
  ],
};

export default function ProjectLayout() {
  const { projectId } = useParams();
  const target = useMemo(() => dummy.data.find((d) => d.id === projectId), [projectId]);

  return (
    <section className="flex h-full p-15">
      <ListSidebar label="team" title={dummy.teamName}>
        <ListProject data={dummy.data} targetId={projectId} />
      </ListSidebar>
      <section className="flex w-2/3 flex-col border border-list bg-contents-box">
        <header className="flex h-30 items-center justify-between border-b p-10">
          <div>
            <small className="mr-5 font-bold text-category">project</small>
            <span className="text-emphasis">{target?.title}</span>
          </div>
          <div className="flex cursor-pointer items-center text-sm text-main">
            <RiSettings5Fill /> Project Setting
          </div>
        </header>
        <div className="grow p-10">
          <ul className="flex border-b *:mr-15">
            <li>
              <NavLink to="calendar" className={({ isActive }) => (isActive ? 'text-main' : 'text-emphasis')}>
                Calendar
              </NavLink>
            </li>
            <li>
              <NavLink to="kanban" className={({ isActive }) => (isActive ? 'text-main' : 'text-emphasis')}>
                Kanban
              </NavLink>
            </li>
          </ul>
          <Outlet />
        </div>
      </section>
    </section>
  );
}
