import { SubmitHandler } from 'react-hook-form';
import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalTaskForm from '@components/modal/task/ModalTaskForm';
import ModaFormButton from '@components/modal/ModaFormButton';
import { Task, TaskForm } from '@/types/TaskType';

type UpdateModalTaskProps = {
  taskId: Task['taskId'];
  onClose: () => void;
};

export default function UpdateModalTask({ taskId, onClose: handleClose }: UpdateModalTaskProps) {
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
        <ModalTaskForm formId="updateTaskForm" taskId={taskId} onSubmit={handleSubmit} />
        <ModaFormButton formId="updateTaskForm" isCreate={false} onClose={handleClose} />
      </ModalLayout>
    </ModalPortal>
  );
}
