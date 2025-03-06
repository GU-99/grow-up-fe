import TeamItem from '@components/team/TeamItem';
import { TeamListWithApproval } from '@/types/TeamType';

type TeamItemListProps = {
  teamList: TeamListWithApproval[];
};

export default function TeamItemList({ teamList }: TeamItemListProps) {
  return (
    <ul className="h-full overflow-y-auto">
      {teamList.map((team) => (
        <TeamItem key={team.teamId} team={team} />
      ))}
    </ul>
  );
}
