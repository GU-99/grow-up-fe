import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalProjectStatusForm from '@components/modal/project-status/ModalProjectStatusForm';
import ModaFormButton from '@components/modal/ModaFormButton';
import { SubmitHandler } from 'react-hook-form';
import { ProjectStatus, ProjectStatusForm } from '@/types/ProjectStatusType';

type ModalProjectStatusProps = {
  onClose: () => void;
  projectStatus: ProjectStatus[];
};

export default function CreateModalProjectStatus({ onClose: handleClose, projectStatus }: ModalProjectStatusProps) {
  // ToDo: 상태 생성을 위한 네트워크 로직 추가
  const handleSubmit: SubmitHandler<ProjectStatusForm> = async (data) => {
    console.log('생성 폼 제출');
    console.log(data);
    handleClose();
  };
  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <div className="flex h-full flex-col items-center justify-center">
          <ModalProjectStatusForm formId="createStatusForm" projectStatus={projectStatus} onSubmit={handleSubmit} />
          <ModaFormButton formId="createStatusForm" isCreate onClose={handleClose} />
        </div>
      </ModalLayout>
    </ModalPortal>
  );
}
