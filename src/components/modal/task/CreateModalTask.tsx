import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalTaskForm from '@components/modal/task/ModalTaskForm';
import ModalFormButton from '@components/modal/ModalFormButton';

import type { SubmitHandler } from 'react-hook-form';
import type { TaskForm } from '@/types/TaskType';
import type { Project } from '@/types/ProjectType';

type CreateModalTaskProps = {
  project: Project;
  onClose: () => void;
};

export default function CreateModalTask({ project, onClose: handleClose }: CreateModalTaskProps) {
  // ToDo: 상태 생성을 위한 네트워크 로직 추가
  const handleSubmit: SubmitHandler<TaskForm> = async (data) => {
    console.log('생성 폼 제출');
    console.log(data);
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
