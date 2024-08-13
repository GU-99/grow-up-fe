import { Link } from 'react-router-dom';
import { IoIosSettings } from 'react-icons/io';
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
          <div className="flex justify-between">
            <Link to={`/teams/${team.teamId}`} className="flex h-30 flex-grow flex-col justify-center px-10">
              <small className="font-bold text-category">Team</small>
              <span>{team.name}</span>
            </Link>
            {/* ToDo: 팀 셋팅 모달 */}
            <button
              className="hover:brightness-5 mr-6 flex items-center text-main"
              type="button"
              onClick={(e) => e.stopPropagation()}
            >
              <IoIosSettings size={20} />
              setting
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
