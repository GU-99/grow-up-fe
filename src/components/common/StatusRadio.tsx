import { useFormContext } from 'react-hook-form';
import { TASK_VALIDATION_RULES } from '@constants/formValidationRules';

import type { FieldError } from 'react-hook-form';
import type { ProjectStatus } from '@/types/ProjectStatusType';

type StatusRadioProps = {
  statusFieldName: string;
  statusList: ProjectStatus[];
};

export default function StatusRadio({ statusFieldName, statusList }: StatusRadioProps) {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      {/* ToDo: 상태 선택 리팩토링 할 것 */}
      <div className="flex items-center justify-start gap-4">
        {statusList.map((status) => {
          const { statusId, statusName, colorCode } = status;
          const isChecked = Number(watch('statusId')) === statusId;
          return (
            <label
              key={statusId}
              htmlFor={statusName}
              className={`flex cursor-pointer items-center rounded-lg border px-5 py-3 text-emphasis ${isChecked ? 'border-input bg-white' : 'bg-button'}`}
            >
              <input
                id={statusName}
                type="radio"
                className="invisible h-0 w-0"
                value={statusId}
                checked={isChecked}
                {...register(statusFieldName, TASK_VALIDATION_RULES.STATUS)}
              />
              <div style={{ borderColor: colorCode }} className="mr-3 h-8 w-8 rounded-full border" />
              <h3 className="text-xs">{statusName}</h3>
            </label>
          );
        })}
      </div>
      <div className={`my-5 h-10 grow text-xs text-error ${errors[statusFieldName] ? 'visible' : 'invisible'}`}>
        {(errors[statusFieldName] as FieldError | undefined)?.message}
      </div>
    </>
  );
}
