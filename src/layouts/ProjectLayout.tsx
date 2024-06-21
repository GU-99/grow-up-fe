import { useMemo } from 'react';
import { RiSettings5Fill } from 'react-icons/ri';
import { Link, NavLink, Outlet, useParams } from 'react-router-dom';

const dummy = [
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
];

// ToDo: 사이드바 공용 컴포넌트로 추출하기
export default function ProjectLayout() {
  const { teamId, projectId } = useParams();
  const target = useMemo(() => dummy.find((d) => d.id === projectId), [projectId]);

  return (
    <section className="flex h-full p-15">
      <aside className="mr-10 flex w-1/3 flex-col border border-list bg-contents-box">
        <div className="flex min-h-30 items-center justify-between bg-sub px-10">
          <div>
            <small className="mr-5 font-bold text-main">team</small>
            <span className="text-emphasis">김찌와소주</span>
          </div>
        </div>
        <ul className="grow overflow-auto">
          {dummy.map((v) => (
            <li
              key={v.id}
              className={`relative cursor-pointer border-b bg-white hover:brightness-90 ${projectId === v.id && 'selected'}`}
            >
              <Link
                to={`/teams/${teamId}/projects/${v.id}/calendar`}
                className="flex h-30 flex-col justify-center px-10"
              >
                <small className="font-bold text-category">project</small>
                <span>{v.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
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
              <NavLink
                to={`/teams/${teamId}/projects/${projectId}/calendar`}
                className={({ isActive }) => (isActive ? 'text-main' : 'text-emphasis')}
              >
                Calendar
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/teams/${teamId}/projects/${projectId}/kanban`}
                className={({ isActive }) => (isActive ? 'text-main' : 'text-emphasis')}
              >
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
