import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModaFormButton from '@components/modal/ModalFormButton';
import ModalTeamForm from '@components/modal/team/ModalTeamForm';

import { SubmitHandler } from 'react-hook-form';
import { Team, TeamForm } from '@/types/TeamType';

type UpdateModalTeamProps = {
  teamId: Team['teamId'];
  onClose: () => void;
};
export default function UpdateModalTeam({ teamId, onClose: handleClose }: UpdateModalTeamProps) {
  const handleSubmit: SubmitHandler<TeamForm> = async (data) => {
    console.log(teamId, '수정 폼 제출');
    console.log(data);
    handleClose();
  };
  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalTeamForm formId="updateTeamForm" teamId={teamId} onSubmit={handleSubmit} />
        <ModaFormButton formId="updateTeamForm" isCreate={false} onClose={handleClose} />
      </ModalLayout>
    </ModalPortal>
  );
}
