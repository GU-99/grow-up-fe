import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalButton from '@components/modal/ModalButton';
import ModalProjectStatusForm from '@components/modal/project-status/ModalProjectStatusForm';

import type { SubmitHandler } from 'react-hook-form';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatusForm } from '@/types/ProjectStatusType';
import { useCreateStatus } from '@/hooks/query/useStatusQuery';

type CreateModalProjectStatusProps = {
  project: Project;
  onClose: () => void;
};

export default function CreateModalProjectStatus({ project, onClose: handleClose }: CreateModalProjectStatusProps) {
  const createStatusFormId = 'createStatusForm';
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
        <ModalProjectStatusForm formId={createStatusFormId} project={project} onSubmit={handleSubmit} />
        <ModalButton formId={createStatusFormId} backgroundColor="bg-main">
          등록
        </ModalButton>
      </ModalLayout>
    </ModalPortal>
  );
}
