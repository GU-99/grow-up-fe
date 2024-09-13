import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TASK_VALIDATION_RULES } from '@constants/formValidationRules';
import ToggleButton from '@components/common/ToggleButton';

import type { FieldError } from 'react-hook-form';
import type { Project } from '@/types/ProjectType';

type PeriodDateInputProps = {
  startDate: Project['startDate'];
  endDate: Project['endDate'];
  startDateName: string;
  endDateName: string;
};

export default function PeriodDateInput({ startDate, endDate, startDateName, endDateName }: PeriodDateInputProps) {
  const [hasDeadline, setHasDeadline] = useState(false);
  const {
    setValue,
    getValues,
    clearErrors,
    watch,
    register,
    formState: { errors },
  } = useFormContext();

  const handleDeadlineToggle = () => {
    setValue(endDateName, getValues(startDateName));
    clearErrors(endDateName);
    setHasDeadline((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center gap-10">
      <label htmlFor={startDateName} className="w-1/2">
        <h3 className="text-large">시작일</h3>
        <input
          id={startDateName}
          type="date"
          {...register(startDateName, {
            ...TASK_VALIDATION_RULES.START_DATE(startDate, endDate),
            onChange: (e) => {
              if (!hasDeadline) setValue(endDateName, e.target.value);
            },
          })}
        />
        <div className={`my-5 h-10 grow text-xs text-error ${errors[startDateName] ? 'visible' : 'invisible'}`}>
          {(errors[startDateName] as FieldError | undefined)?.message}
        </div>
      </label>
      <label htmlFor={endDateName} className="w-1/2">
        <h3 className="flex items-center space-x-2 text-large">
          <span>종료일</span>
          <ToggleButton id="deadline" checked={hasDeadline} onChange={handleDeadlineToggle} />
        </h3>
        <input
          id={endDateName}
          type="date"
          className={`${hasDeadline ? '' : '!bg-disable'}`}
          disabled={!hasDeadline}
          {...register(
            endDateName,
            TASK_VALIDATION_RULES.END_DATE(hasDeadline, startDate, endDate, watch(startDateName)),
          )}
        />
        <div className={`my-5 h-10 grow text-xs text-error ${errors[endDateName] ? 'visible' : 'invisible'}`}>
          {(errors[endDateName] as FieldError | undefined)?.message}
        </div>
      </label>
    </div>
  );
}
