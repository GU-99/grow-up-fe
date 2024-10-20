import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosSettings } from 'react-icons/io';
import UpdateModalTeam from '@components/modal/team/UpdateModalTeam';
import useModal from '@hooks/useModal';
import type { Team } from '@/types/TeamType';

type ListTeamProps = {
  data: Team[];
  targetId?: string;
};

export default function ListTeam({ data, targetId }: ListTeamProps) {
  const { showModal: showUpdateModal, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();
  const [selectedTeamId, setSelectedTeamId] = useState<Team['teamId'] | null>(null);

  const handleOpenUpdateModal = (teamId: Team['teamId']) => {
    setSelectedTeamId(teamId);
    openUpdateModal();
  };

  return (
    <>
      <ul className="grow overflow-auto">
        {data.map((team) => (
          <li
            key={team.teamId}
            className={`relative cursor-pointer border-b bg-white hover:brightness-90 ${targetId === team.teamId.toString() ? 'selected' : ''}`}
          >
            <div className="flex justify-between">
              <Link to={`/teams/${team.teamId}`} className="flex h-30 grow flex-col justify-center px-10">
                <small className="font-bold text-category">team</small>
                <span>{team.teamName}</span>
              </Link>
              <button
                className="mr-6 flex items-center text-main hover:brightness-50"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenUpdateModal(team.teamId);
                }}
              >
                <IoIosSettings size={20} />
                setting
              </button>
            </div>
          </li>
        ))}
      </ul>
      {showUpdateModal && selectedTeamId && <UpdateModalTeam teamId={selectedTeamId} onClose={closeUpdateModal} />}
    </>
  );
}
