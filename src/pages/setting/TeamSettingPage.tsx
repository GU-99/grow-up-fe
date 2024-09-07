import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Spinner from '@/components/common/Spinner';
import useTeamList from '@/hooks/query/useTeamQuery';

export default function TeamSettingPage() {
  const navigate = useNavigate();

  const { joinedTeamList, invitedTeamList, isLoading } = useTeamList();

  useEffect(() => {
    navigate('/setting/teams/joined');
  }, [navigate]);

  if (isLoading) return <Spinner />;

  return (
    <section className="h-full">
      <section className="mt-10 space-x-4 border-b-2 px-10">
        <button type="button" onClick={() => navigate('/setting/teams/joined')}>
          가입현황
        </button>
        <button type="button" onClick={() => navigate('/setting/teams/invited')}>
          대기현황
        </button>
      </section>

      <section className="mt-6 h-full overflow-y-auto px-10">
        <Outlet context={{ joinedTeamList, invitedTeamList }} />
      </section>
    </section>
  );
}
