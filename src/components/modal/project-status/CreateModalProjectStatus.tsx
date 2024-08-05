import { SubmitHandler } from 'react-hook-form';
import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalProjectStatusForm from '@components/modal/project-status/ModalProjectStatusForm';
import ModaFormButton from '@components/modal/ModaFormButton';
import { ProjectStatusForm } from '@/types/ProjectStatusType';

type CreateModalProjectStatusProps = {
  onClose: () => void;
};

export default function CreateModalProjectStatus({ onClose: handleClose }: CreateModalProjectStatusProps) {
  // ToDo: 상태 생성을 위한 네트워크 로직 추가
  const handleSubmit: SubmitHandler<ProjectStatusForm> = async (data) => {
    console.log('생성 폼 제출');
    console.log(data);
    handleClose();
  };
  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalProjectStatusForm formId="createStatusForm" onSubmit={handleSubmit} />
        <ModaFormButton formId="createStatusForm" isCreate onClose={handleClose} />
      </ModalLayout>
    </ModalPortal>
  );
}
