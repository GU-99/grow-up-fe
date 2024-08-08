import { Link } from 'react-router-dom';
import type { Team } from '@/types/TeamType';

type ListTeamProps = {
  data: Team[];
  targetId?: string;
};

export default function ListTeam({ data, targetId }: ListTeamProps) {
  return (
    <ul className="grow overflow-auto">
      {data.map((team) => (
        <li
          key={team.teamId}
          className={`relative cursor-pointer border-b bg-white hover:brightness-90 ${targetId === team.teamId.toString() ? 'selected' : ''}`}
        >
          <Link to={`/teams/${team.teamId}`} className="flex h-30 flex-col justify-center px-10">
            <small className="font-bold text-category">Team</small>
            <span>{team.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
