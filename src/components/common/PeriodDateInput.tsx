import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TASK_VALIDATION_RULES } from '@constants/formValidationRules';
import ToggleButton from '@components/common/ToggleButton';

import type { FieldError } from 'react-hook-form';
import type { Project } from '@/types/ProjectType';

type PeriodDateInputProps = {
  startDateLabel: string;
  endDateLabel: string;
  startDateId: string;
  endDateId: string;
  startDate: Project['startDate'];
  endDate: Project['endDate'];
  startDateFieldName: string;
  endDateFieldName: string;
};

export default function PeriodDateInput({
  startDateLabel,
  endDateLabel,
  startDateId,
  endDateId,
  startDate,
  endDate,
  startDateFieldName,
  endDateFieldName,
}: PeriodDateInputProps) {
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
    setValue(endDateFieldName, getValues(startDateFieldName));
    clearErrors(endDateFieldName);
    setHasDeadline((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center gap-10">
      <label htmlFor={startDateId} className="w-1/2">
        <h3 className="text-large">{startDateLabel}</h3>
        <input
          id={startDateId}
          type="date"
          {...register(startDateFieldName, {
            ...TASK_VALIDATION_RULES.START_DATE(startDate, endDate),
            onChange: (e) => {
              if (!hasDeadline) setValue(endDateFieldName, e.target.value);
            },
          })}
        />
        <div className={`my-5 h-10 grow text-xs text-error ${errors[startDateFieldName] ? 'visible' : 'invisible'}`}>
          {(errors[startDateFieldName] as FieldError | undefined)?.message}
        </div>
      </label>
      <label htmlFor={endDateId} className="w-1/2">
        <h3 className="flex items-center space-x-2 text-large">
          <span>{endDateLabel}</span>
          <ToggleButton id="deadline" checked={hasDeadline} onChange={handleDeadlineToggle} />
        </h3>
        <input
          id={endDateId}
          type="date"
          className={`${hasDeadline ? '' : '!bg-disable'}`}
          disabled={!hasDeadline}
          {...register(
            endDateFieldName,
            TASK_VALIDATION_RULES.END_DATE(hasDeadline, startDate, endDate, watch(startDateFieldName)),
          )}
        />
        <div className={`my-5 h-10 grow text-xs text-error ${errors[endDateFieldName] ? 'visible' : 'invisible'}`}>
          {(errors[endDateFieldName] as FieldError | undefined)?.message}
        </div>
      </label>
    </div>
  );
}
