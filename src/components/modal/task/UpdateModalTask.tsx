import { SubmitHandler } from 'react-hook-form';
import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalTaskForm from '@components/modal/task/ModalTaskForm';
import ModalFormButton from '@components/modal/ModalFormButton';
import { Task, TaskForm } from '@/types/TaskType';
import { Project } from '@/types/ProjectType';

type UpdateModalTaskProps = {
  project: Project;
  taskId: Task['taskId'];
  onClose: () => void;
};

export default function UpdateModalTask({ project, taskId, onClose: handleClose }: UpdateModalTaskProps) {
  // ToDo: 상태 생성을 위한 네트워크 로직 추가
  const handleSubmit: SubmitHandler<TaskForm> = async (data) => {
    console.log('생성 폼 제출');
    console.log(data);
    handleClose();
  };
  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        {/* ToDo: Task 수정 모달 작성시 수정할 것 */}
        <ModalTaskForm formId="updateTaskForm" taskId={taskId} project={project} onSubmit={handleSubmit} />
        <ModalFormButton formId="updateTaskForm" isCreate={false} onClose={handleClose} />
      </ModalLayout>
    </ModalPortal>
  );
}
