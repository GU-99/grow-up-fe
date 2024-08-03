import { SubmitHandler, useForm } from 'react-hook-form';
import { Task, TaskForm } from '@/types/TaskType';

type ModalTaskFromProps = {
  formId: string;
  taskId?: Task['taskId'];
  onSubmit: SubmitHandler<TaskForm>;
};

// ToDo: Task 모달 작성시 Task Form 만들기
export default function ModalTaskForm({ formId, taskId, onSubmit }: ModalTaskFromProps) {
  const { register, handleSubmit } = useForm<TaskForm>({
    mode: 'onChange',
    defaultValues: {},
  });
  return (
    <form id={formId} className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
      <div>{taskId}</div>
    </form>
  );
}
