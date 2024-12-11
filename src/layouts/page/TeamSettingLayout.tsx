import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Spinner from '@components/common/Spinner';
import { useReadTeams } from '@hooks/query/useTeamQuery';

export default function TeamSettingLayout() {
  const navigate = useNavigate();

  const { joinedTeamList, invitedTeamList, isLoading } = useReadTeams();

  useEffect(() => {
    navigate('/setting/teams/joined');
  }, [navigate]);

  if (isLoading) return <Spinner />;

  return (
    <section className="flex h-full flex-col">
      <section className="mt-10 space-x-4 border-b-2 px-10">
        <NavLink to="/setting/teams/joined" className={({ isActive }) => (isActive ? 'text-main' : 'text-emphasis')}>
          가입현황
        </NavLink>
        <NavLink to="/setting/teams/invited" className={({ isActive }) => (isActive ? 'text-main' : 'text-emphasis')}>
          대기현황
        </NavLink>
      </section>

      <section className="grow overflow-y-auto">
        <Outlet context={{ joinedTeamList, invitedTeamList }} />
      </section>
    </section>
  );
}
