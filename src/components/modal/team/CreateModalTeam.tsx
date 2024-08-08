import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalFormButton from '@components/modal/ModalFormButton';
import ModalTeamForm from '@components/modal/team/ModalTeamForm';

import type { SubmitHandler } from 'react-hook-form';
import type { Team } from '@/types/TeamType';

type CreateModalProjectStatusProps = {
  onClose: () => void;
};

export default function CreateModalTeam({ onClose: handleClose }: CreateModalProjectStatusProps) {
  const handleSubmit: SubmitHandler<Team> = async (data) => {
    console.log('팀 생성 폼 제출');
    console.log(data);
    handleClose();
  };

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalTeamForm formId="createTeamForm" onSubmit={handleSubmit} />
        <ModalFormButton formId="createTeamForm" isCreate onClose={handleClose} />
      </ModalLayout>
    </ModalPortal>
  );
}
