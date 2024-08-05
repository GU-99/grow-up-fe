import { SubmitHandler } from 'react-hook-form';
import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalTaskForm from '@components/modal/task/ModalTaskForm';
import ModaFormButton from '@components/modal/ModaFormButton';
import { TaskForm } from '@/types/TaskType';

type CreateModalTaskProps = {
  onClose: () => void;
};

export default function CreateModalTask({ onClose: handleClose }: CreateModalTaskProps) {
  // ToDo: 상태 생성을 위한 네트워크 로직 추가
  const handleSubmit: SubmitHandler<TaskForm> = async (data) => {
    console.log('생성 폼 제출');
    console.log(data);
    handleClose();
  };
  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <div className="flex h-full flex-col items-center justify-center">
          {/* ToDo: Task 생성 모달 작성시 수정할 것 */}
          <ModalTaskForm formId="updateTaskForm" onSubmit={handleSubmit} />
          <ModaFormButton formId="updateTaskForm" isCreate={false} onClose={handleClose} />
        </div>
      </ModalLayout>
    </ModalPortal>
  );
}