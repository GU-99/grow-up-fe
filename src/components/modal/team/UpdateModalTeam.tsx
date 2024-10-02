import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalButton from '@components/modal/ModalButton';
import ModalTeamForm from '@components/modal/team/ModalTeamForm';

import { SubmitHandler } from 'react-hook-form';
import { Team, TeamForm } from '@/types/TeamType';

type UpdateModalTeamProps = {
  teamId: Team['teamId'];
  onClose: () => void;
};
export default function UpdateModalTeam({ teamId, onClose: handleClose }: UpdateModalTeamProps) {
  const updateTeamFormId = 'updateTeamForm';
  const handleSubmit: SubmitHandler<TeamForm> = async (data) => {
    console.log(teamId, '수정 폼 제출');
    console.log(data);
    handleClose();
  };

  // ToDo: 팀 수정 API 작업시 같이 작업할 것.
  const handleUpdateClick = () => {};

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalTeamForm formId={updateTeamFormId} teamId={teamId} onSubmit={handleSubmit} />
        <ModalButton formId={updateTeamFormId} backgroundColor="bg-main" onClick={handleUpdateClick}>
          수정
        </ModalButton>
      </ModalLayout>
    </ModalPortal>
  );
}
