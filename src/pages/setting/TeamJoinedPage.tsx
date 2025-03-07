import Meta from '@components/common/Meta';
import Spinner from '@components/common/Spinner';
import TeamItemList from '@components/team/TeamItemList';
import EmptyTeamItemList from '@components/team/EmptyTeamItemList';
import { useReadTeams } from '@hooks/query/useTeamQuery';

export default function JoinedTeamPage() {
  const { joinedTeamList, isLoading } = useReadTeams();

  if (isLoading) return <Spinner />;

  return (
    <>
      <Meta title="Grow Up : 팀 가입 현황" />
      <article className="h-full" aria-label="가입된 팀 목록">
        {joinedTeamList && joinedTeamList.length > 0 ? (
          <TeamItemList teamList={joinedTeamList} />
        ) : (
          <EmptyTeamItemList />
        )}
      </article>
    </>
  );
}
