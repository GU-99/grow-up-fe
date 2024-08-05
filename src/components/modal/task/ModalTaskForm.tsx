import { DateTime } from 'luxon';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TASK_VALIDATION_RULES } from '@constants/formValidationRules';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import { IoSearch } from 'react-icons/io5';
import { Task, TaskForm } from '@/types/TaskType';

type ModalTaskFormProps = {
  formId: string;
  taskId?: Task['taskId'];
  onSubmit: SubmitHandler<TaskForm>;
};

export default function ModalTaskForm({ formId, taskId, onSubmit }: ModalTaskFormProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      content: '',
      startDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
      endDate: undefined,
    },
  });

  return (
    <form id={formId} className="mb-20 flex grow flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
      {/* ToDo: 할일명 목록 추출하여 전달하기 */}
      <DuplicationCheckInput
        id="name"
        label="일정"
        value={watch('name')}
        placeholder="일정명을 입력해주세요."
        errors={errors.name?.message}
        register={register('name', TASK_VALIDATION_RULES.TASK_NAME(['test']))}
      />

      <div>
        <div className="flex items-center justify-center gap-10">
          <label htmlFor="startDate" className="grow">
            <h3 className="text-large">시작일</h3>
            <input type="date" id="startDate" {...register('startDate')} />
            <div className={`my-5 h-10 grow text-xs text-error ${errors.startDate ? 'visible' : 'invisible'}`}>
              {errors.startDate?.message}
            </div>
          </label>
          <label htmlFor="endDate" className="grow">
            <h3 className="flex items-center text-large">종료일</h3>
            <input type="date" id="endDate" {...register('endDate')} />
            <div className={`my-5 h-10 grow text-xs text-error ${errors.startDate ? 'visible' : 'invisible'}`}>
              {errors.startDate?.message}
            </div>
          </label>
        </div>
      </div>

      <label htmlFor="user" className="mb-20 flex items-center gap-5">
        <h3 className="text-large">수행자</h3>
        <div className="relative grow">
          <input
            type="text"
            id="user"
            className="h-25 w-full rounded-md border border-input pl-10 pr-25 text-regular placeholder:text-xs"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <IoSearch className="size-15 text-emphasis" />
          </div>
        </div>
      </label>

      <label htmlFor="content" className="mb-20">
        <h3 className="text-large">내용</h3>
        <textarea name="content" id="content" className="w-full border" rows={5} />
      </label>

      <label htmlFor="files">
        <h3 className="text-large">첨부파일</h3>
        <input type="file" id="files" />
      </label>
    </form>
  );
}
