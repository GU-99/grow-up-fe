import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalFormButton from '@components/modal/ModalFormButton';
import ModalTeamForm from '@components/modal/team/ModalTeamForm';

import type { SubmitHandler } from 'react-hook-form';
import { useCreateTeam } from '@hooks/query/useTeamQuery';
import type { TeamForm } from '@/types/TeamType';

type CreateModalProjectStatusProps = {
  onClose: () => void;
};

export default function CreateModalTeam({ onClose: handleClose }: CreateModalProjectStatusProps) {
  const { mutate: createTeam } = useCreateTeam();

  const handleSubmit: SubmitHandler<TeamForm> = async (data) => {
    createTeam(data, {
      onSuccess: () => {
        handleClose();
      },
    });
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
