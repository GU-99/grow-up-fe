import { SubmitHandler } from 'react-hook-form';
import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModaFormButton from '@components/modal/ModaFormButton';
import { Team } from '@/types/TeamType';
import ModalTeamForm from './ModalTeamForm';

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
        <div className="flex h-full flex-col items-center justify-center">
          <ModalTeamForm formId="createTeamForm" onSubmit={handleSubmit} />
          <ModaFormButton formId="createTeamForm" isCreate onClose={handleClose} />
        </div>
      </ModalLayout>
    </ModalPortal>
  );
}
