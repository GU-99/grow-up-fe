import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalProjectStatusForm from '@components/modal/project-status/ModalProjectStatusForm';
import ModalFormButton from '@components/modal/ModalFormButton';

import type { SubmitHandler } from 'react-hook-form';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatusForm } from '@/types/ProjectStatusType';
import { useCreateStatus } from '@/hooks/query/useStatusQuery';

type CreateModalProjectStatusProps = {
  project: Project;
  onClose: () => void;
};

export default function CreateModalProjectStatus({ project, onClose: handleClose }: CreateModalProjectStatusProps) {
  const statusMutation = useCreateStatus(project.projectId);

  // ToDo: Error 처리 추가할 것
  const handleSubmit: SubmitHandler<ProjectStatusForm> = async (data) => {
    statusMutation.mutate(data);
    statusMutation.reset();
    handleClose();
  };
  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalProjectStatusForm formId="createStatusForm" project={project} onSubmit={handleSubmit} />
        <ModalFormButton formId="createStatusForm" isCreate onClose={handleClose} />
      </ModalLayout>
    </ModalPortal>
  );
}
