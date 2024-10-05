import { useQueryClient } from '@tanstack/react-query';
import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalButton from '@components/modal/ModalButton';
import ModalTaskForm from '@components/modal/task/ModalTaskForm';
import useToast from '@hooks/useToast';
import useTaskFile from '@hooks/useTaskFile';
import { useCreateStatusTask, useReadStatusTasks } from '@hooks/query/useTaskQuery';

import type { SubmitHandler } from 'react-hook-form';
import type { Project } from '@/types/ProjectType';
import type { TaskForm } from '@/types/TaskType';
import type { ProjectStatus } from '@/types/ProjectStatusType';

type CreateModalTaskProps = {
  project: Project;
  onClose: () => void;
};

export default function CreateModalTask({ project, onClose: handleClose }: CreateModalTaskProps) {
  const createTaskFormId = 'createTaskForm';
  const { toastError } = useToast();
  const { mutateAsync: createTaskInfoMutateAsync } = useCreateStatusTask(project.projectId);
  const { taskFilesUpload } = useTaskFile(project.projectId);
  const { statusTaskList } = useReadStatusTasks(project.projectId);

  const getLastSortOrder = (statusId: ProjectStatus['statusId']) => {
    const statusTask = statusTaskList.find((statusTask) => statusTask.statusId === Number(statusId));
    if (!statusTask) {
      toastError('선택하신 프로젝트 상태는 존재하지 않습니다. ');
      throw Error('프로젝트 상태가 존재하지 않습니다.');
    }
    return statusTask.tasks.length + 1;
  };

  const handleSubmit: SubmitHandler<TaskForm> = async (taskFormData) => {
    const { files, ...taskInfoForm } = taskFormData;
    const sortOrder = getLastSortOrder(taskFormData.statusId);

    // 일정 정보 등록
    const { data: taskInfo } = await createTaskInfoMutateAsync({ ...taskInfoForm, sortOrder });

    // 일정 파일 업로드
    if (files.length > 0) await taskFilesUpload(taskInfo.taskId, files);
    handleClose();
  };

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalTaskForm formId={createTaskFormId} project={project} onSubmit={handleSubmit} />
        <ModalButton formId={createTaskFormId} backgroundColor="bg-main">
          등록
        </ModalButton>
      </ModalLayout>
    </ModalPortal>
  );
}
