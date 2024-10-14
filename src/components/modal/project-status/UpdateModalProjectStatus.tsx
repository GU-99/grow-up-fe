import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalButton from '@components/modal/ModalButton';
import ModalProjectStatusForm from '@components/modal/project-status/ModalProjectStatusForm';
import Spinner from '@components/common/Spinner';
import useToast from '@hooks/useToast';
import { useReadStatusTasks } from '@hooks/query/useTaskQuery';
import { useDeleteStatus, useUpdateStatus } from '@hooks/query/useStatusQuery';

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

  const { statusTaskList, isTaskLoading } = useReadStatusTasks(project.projectId);
  const { mutate: updateStatusMutate } = useUpdateStatus(project.projectId, statusId);
  const { mutate: deleteStatusMutate } = useDeleteStatus(project.projectId);
  const { toastWarn } = useToast();

  // ToDo: Error 처리 추가
  const handleSubmit: SubmitHandler<ProjectStatusForm> = async (data) => {
    updateStatusMutate(data);
    handleClose();
  };

  // ToDo: 유저 권한 확인하는 로직 추가할 것
  const handleDeleteClick = (statusId: ProjectStatus['statusId']) => {
    try {
      const statusTasks = statusTaskList.find((statusTask) => statusTask.statusId === statusId);
      if (!statusTasks) throw new Error('일치하는 프로젝트 상태가 없습니다.');
      if (statusTasks.tasks.length > 0) return toastWarn('프로젝트 상태에 일정이 등록되어 있습니다.');
    } catch (error) {
      if (error instanceof Error) console.error(`${error.name}:${error.message}`);
    }
    deleteStatusMutate(statusId);
  };

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        {isTaskLoading ? (
          <Spinner />
        ) : (
          <>
            <ModalProjectStatusForm
              formId={updateStatusFormId}
              project={project}
              statusId={statusId}
              onSubmit={handleSubmit}
            />
            <div className="flex min-h-25 w-4/5 gap-10">
              <ModalButton formId={updateStatusFormId} color="text-white" backgroundColor="bg-main">
                수정
              </ModalButton>
              <ModalButton color="text-white" backgroundColor="bg-delete" onClick={() => handleDeleteClick(statusId)}>
                삭제
              </ModalButton>
            </div>
          </>
        )}
      </ModalLayout>
    </ModalPortal>
  );
}
