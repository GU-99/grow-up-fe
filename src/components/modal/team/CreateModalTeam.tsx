import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalButton from '@components/modal/ModalButton';
import ModalTeamForm from '@components/modal/team/ModalTeamForm';

import type { SubmitHandler } from 'react-hook-form';
import { useCreateTeam } from '@hooks/query/useTeamQuery';
import type { TeamForm } from '@/types/TeamType';

type CreateModalProjectStatusProps = {
  onClose: () => void;
};

export default function CreateModalTeam({ onClose: handleClose }: CreateModalProjectStatusProps) {
  const createTeamFormId = 'createTeamForm';
  const { mutate: createTeam } = useCreateTeam();

  const handleSubmit: SubmitHandler<TeamForm> = async (data) => {
    createTeam(data);
    handleClose();
  };

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalTeamForm formId={createTeamFormId} onSubmit={handleSubmit} />
        <ModalButton formId={createTeamFormId} color="text-white" backgroundColor="bg-main">
          등록
        </ModalButton>
      </ModalLayout>
    </ModalPortal>
  );
}
