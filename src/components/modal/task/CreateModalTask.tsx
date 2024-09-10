import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalTaskForm from '@components/modal/task/ModalTaskForm';
import ModalFormButton from '@components/modal/ModalFormButton';
import { useCreateStatusTask, useReadStatusTasks } from '@hooks/query/useTaskQuery';
import useToast from '@hooks/useToast';

import type { SubmitHandler } from 'react-hook-form';
import type { TaskForm } from '@/types/TaskType';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus } from '@/types/ProjectStatusType';

type CreateModalTaskProps = {
  project: Project;
  onClose: () => void;
};

export default function CreateModalTask({ project, onClose: handleClose }: CreateModalTaskProps) {
  const { toastError } = useToast();
  const { mutate: createTaskMutate } = useCreateStatusTask(project.projectId);
  const { statusTaskList } = useReadStatusTasks(project.projectId);

  const getLastSortOrder = (statusId: ProjectStatus['statusId']) => {
    const statusTask = statusTaskList.find((statusTask) => statusTask.statusId === Number(statusId));
    if (!statusTask) {
      toastError('선택하신 프로젝트 상태는 존재하지 않습니다. ');
      throw Error('프로젝트 상태가 존재하지 않습니다.');
    }
    return statusTask.tasks.length + 1;
  };

  // ToDo: 파일 생성 위한 네트워크 로직 추가
  const handleSubmit: SubmitHandler<TaskForm> = async (taskFormData) => {
    const sortOrder = getLastSortOrder(taskFormData.statusId);
    createTaskMutate({ ...taskFormData, sortOrder });
    handleClose();
  };
  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalTaskForm formId="createTaskForm" project={project} onSubmit={handleSubmit} />
        <ModalFormButton formId="createTaskForm" isCreate onClose={handleClose} />
      </ModalLayout>
    </ModalPortal>
  );
}
