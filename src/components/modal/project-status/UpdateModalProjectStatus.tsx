import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalProjectStatusForm from '@components/modal/project-status/ModalProjectStatusForm';
import ModalFormButton from '@components/modal/ModalFormButton';

import type { SubmitHandler } from 'react-hook-form';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus, ProjectStatusForm } from '@/types/ProjectStatusType';

type UpdateModalProjectStatusProps = {
  project: Project;
  statusId: ProjectStatus['statusId'];
  onClose: () => void;
};

export default function UpdateModalProjectStatus({
  project,
  statusId,
  onClose: handleClose,
}: UpdateModalProjectStatusProps) {
  // ToDo: 상태 수정을 위한 네트워크 로직 추가
  const handleSubmit: SubmitHandler<ProjectStatusForm> = async (data) => {
    console.log(statusId, '수정 폼 제출');
    console.log(data);
    handleClose();
  };

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalProjectStatusForm
          formId="updateStatusForm"
          project={project}
          statusId={statusId}
          onSubmit={handleSubmit}
        />
        <ModalFormButton formId="updateStatusForm" isCreate={false} onClose={handleClose} />
      </ModalLayout>
    </ModalPortal>
  );
}
