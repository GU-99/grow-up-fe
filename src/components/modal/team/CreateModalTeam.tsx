import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalButton from '@components/modal/ModalButton';
import ModalTeamForm from '@components/modal/team/ModalTeamForm';

import type { SubmitHandler } from 'react-hook-form';
import type { Team } from '@/types/TeamType';

type CreateModalProjectStatusProps = {
  onClose: () => void;
};

export default function CreateModalTeam({ onClose: handleClose }: CreateModalProjectStatusProps) {
  const createTeamFormId = 'createTeamForm';

  const handleSubmit: SubmitHandler<Team> = async (data) => {
    console.log('팀 생성 폼 제출');
    console.log(data);
    handleClose();
  };

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalTeamForm formId={createTeamFormId} onSubmit={handleSubmit} />
        <ModalButton formId={createTeamFormId} backgroundColor="bg-main">
          등록
        </ModalButton>
      </ModalLayout>
    </ModalPortal>
  );
}
