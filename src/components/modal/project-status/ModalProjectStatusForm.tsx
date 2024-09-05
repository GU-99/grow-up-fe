import { useForm } from 'react-hook-form';
import { RiProhibited2Fill } from 'react-icons/ri';
import { STATUS_VALIDATION_RULES } from '@constants/formValidationRules';
import Spinner from '@components/common/Spinner';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import { useReadStatuses } from '@hooks/query/useStatusQuery';

import type { SubmitHandler } from 'react-hook-form';
import { useEffect } from 'react';
import type { ProjectStatus, ProjectStatusForm } from '@/types/ProjectStatusType';
import type { Project } from '@/types/ProjectType';

type ModalProjectStatusFormProps = {
  formId: string;
  project: Project;
  statusId?: ProjectStatus['statusId'];
  onSubmit: SubmitHandler<ProjectStatusForm>;
};

export default function ModalProjectStatusForm({ formId, project, statusId, onSubmit }: ModalProjectStatusFormProps) {
  const { isStatusLoading, initialValue, nameList, colorList, usableColorList } = useReadStatuses(
    project.projectId,
    statusId,
  );

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectStatusForm>({
    mode: 'onChange',
    defaultValues: initialValue,
  });

  useEffect(() => {
    reset(initialValue);
  }, [initialValue, reset]);

  if (isStatusLoading) return <Spinner />;

  return (
    <form id={formId} className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
      <DuplicationCheckInput
        id="name"
        label="상태명"
        value={watch('statusName')}
        placeholder="상태명을 입력하세요."
        errors={errors.statusName?.message}
        register={register('statusName', STATUS_VALIDATION_RULES.STATUS_NAME(nameList))}
      />
      <h3 className="text-large">색상</h3>
      <section className="grid grid-cols-8 gap-4">
        {usableColorList.map(({ colorCode, isUsable }, index) => (
          <div className="group relative m-auto" key={index}>
            <label
              htmlFor={colorCode}
              style={{ backgroundColor: colorCode }}
              className={`inline-block size-20 cursor-pointer rounded-full ${isUsable && watch('colorCode') === colorCode ? 'border-4 border-selected' : ''}`}
            >
              <input
                type="radio"
                id={colorCode}
                value={colorCode}
                className="hidden"
                disabled={!isUsable}
                {...register('colorCode', STATUS_VALIDATION_RULES.COLOR(colorList))}
              />
              {!isUsable && <RiProhibited2Fill className="size-20 text-white" />}
            </label>
          </div>
        ))}
      </section>
      {errors.colorCode && <div className="mt-5 text-xs text-error">{errors.colorCode.message}</div>}
    </form>
  );
}
