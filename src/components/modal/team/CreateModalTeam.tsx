import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalFormButton from '@components/modal/ModalFormButton';
import ModalTeamForm from '@components/modal/team/ModalTeamForm';

import type { SubmitHandler } from 'react-hook-form';
import type { TeamForm } from '@/types/TeamType';
import { createTeam } from '@/services/teamService';

type CreateModalProjectStatusProps = {
  onClose: () => void;
};

export default function CreateModalTeam({ onClose: handleClose }: CreateModalProjectStatusProps) {
  const handleSubmit: SubmitHandler<TeamForm> = async (data) => {
    try {
      await createTeam(data);
      handleClose();
    } catch (error) {
      console.error('팀 생성 중 오류 발생:', error);
    }
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
