import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalButton from '@components/modal/ModalButton';
import ModalProjectStatusForm from '@components/modal/project-status/ModalProjectStatusForm';
import { useUpdateStatus } from '@hooks/query/useStatusQuery';

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
  const updateStatusFormId = 'updateStatusForm';
  const updateMutation = useUpdateStatus(project.projectId, statusId);

  // ToDo: Error 처리 추가
  const handleSubmit: SubmitHandler<ProjectStatusForm> = async (data) => {
    updateMutation.mutate(data);
    updateMutation.reset();
    handleClose();
  };

  // ToDo: 상태 삭제 작업시 채워둘것
  const handleDeleteClick = () => {};

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalProjectStatusForm
          formId={updateStatusFormId}
          project={project}
          statusId={statusId}
          onSubmit={handleSubmit}
        />
        <div className="flex min-h-25 w-4/5 gap-10">
          <ModalButton formId={updateStatusFormId} backgroundColor="bg-main">
            수정
          </ModalButton>
          <ModalButton backgroundColor="bg-delete" onClick={handleDeleteClick}>
            삭제
          </ModalButton>
        </div>
      </ModalLayout>
    </ModalPortal>
  );
}
