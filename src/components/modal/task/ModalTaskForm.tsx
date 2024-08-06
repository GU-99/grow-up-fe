import { useState } from 'react';
import { DateTime } from 'luxon';
import { IoSearch } from 'react-icons/io5';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TASK_VALIDATION_RULES } from '@constants/formValidationRules';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import useTaskQuery from '@hooks/query/useTaskQuery';
import { Task, TaskForm } from '@/types/TaskType';
import { Project } from '@/types/ProjectType';

type ModalTaskFormProps = {
  formId: string;
  project: Project;
  taskId?: Task['taskId'];
  onSubmit: SubmitHandler<TaskForm>;
};

export default function ModalTaskForm({ formId, project, taskId, onSubmit }: ModalTaskFormProps) {
  const { startDate: projectStartDate, endDate: projectEndDate } = project;
  const [hasDeadline, setHasDeadline] = useState(false);
  const { taskNameList } = useTaskQuery(project.projectId);
  const {
    register,
    watch,
    setValue,
    getValues,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      content: '',
      startDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
      endDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
    },
  });

  const handleDeadlineToggle = () => {
    setValue('endDate', getValues('startDate'));
    clearErrors('endDate');
    setHasDeadline((prev) => !prev);
  };

  return (
    <form
      id={formId}
      className="mb-20 flex w-4/5 max-w-375 grow flex-col justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DuplicationCheckInput
        id="name"
        label="일정"
        value={watch('name')}
        placeholder="일정명을 입력해주세요."
        errors={errors.name?.message}
        register={register('name', TASK_VALIDATION_RULES.TASK_NAME(taskNameList))}
      />

      <div>
        <div className="flex items-center justify-center gap-10">
          <label htmlFor="startDate" className="w-1/2">
            <h3 className="text-large">시작일</h3>
            <input
              type="date"
              id="startDate"
              {...register('startDate', TASK_VALIDATION_RULES.START_DATE(projectStartDate, projectEndDate))}
            />
            <div className={`my-5 h-10 grow text-xs text-error ${errors.startDate ? 'visible' : 'invisible'}`}>
              {errors.startDate?.message}
            </div>
          </label>
          <label htmlFor="endDate" className="w-1/2">
            <h3 className="flex items-center text-large">
              종료일
              <label htmlFor="deadline" className="relative ml-2 inline-block h-10 w-20">
                <input
                  type="checkbox"
                  id="deadline"
                  className="peer h-0 w-0 border-main opacity-0"
                  checked={hasDeadline}
                  onChange={handleDeadlineToggle}
                />
                {/* prettier-ignore */}
                <span className="
                  absolute bottom-0 left-0 right-0 top-0 cursor-pointer rounded-full bg-disable transition duration-300
                  before:content-[''] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:size-7
                  before:rounded-full before:bg-white before:transition before:duration-300
                  peer-checked:bg-main peer-checked:before:translate-x-9
                "/>
              </label>
            </h3>
            <input
              type="date"
              id="endDate"
              className={`${hasDeadline ? '' : '!bg-disable'}`}
              disabled={!hasDeadline}
              {...register(
                'endDate',
                TASK_VALIDATION_RULES.END_DATE(hasDeadline, projectStartDate, projectEndDate, watch('startDate')),
              )}
            />
            <div className={`my-5 h-10 grow text-xs text-error ${errors.endDate ? 'visible' : 'invisible'}`}>
              {errors.endDate?.message}
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
