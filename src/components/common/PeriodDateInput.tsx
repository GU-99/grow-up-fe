import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useFormContext } from 'react-hook-form';
import { PERIOD_VALIDATION_RULES } from '@constants/formValidationRules';
import ToggleButton from '@components/common/ToggleButton';
import useToast from '@hooks/useToast';

import type { FieldError } from 'react-hook-form';

type PeriodDateInputProps = {
  startDateId: string;
  endDateId: string;
  startDateLabel: string;
  endDateLabel: string;
  startDateFieldName: string;
  endDateFieldName: string;
  enableEndDateSync: boolean;
  limitStartDate?: string | Date | null;
  limitEndDate?: string | Date | null;
};

export default function PeriodDateInput({
  startDateId,
  endDateId,
  startDateLabel,
  endDateLabel,
  startDateFieldName,
  endDateFieldName,
  limitStartDate = null,
  limitEndDate = null,
  enableEndDateSync = true,
}: PeriodDateInputProps) {
  const [hasDeadline, setHasDeadline] = useState(false);
  const { toastWarn } = useToast();
  const {
    setValue,
    getValues,
    clearErrors,
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const startDateStr = watch(startDateFieldName);
  const endDateStr = watch(endDateFieldName);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = DateTime.fromISO(e.target.value).startOf('day');
    const endDate = DateTime.fromISO(endDateStr).startOf('day');

    const shouldUpdateEndDate = !hasDeadline || (endDate && startDate > endDate);
    if (shouldUpdateEndDate) {
      setValue(endDateFieldName, enableEndDateSync ? e.target.value : null);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = DateTime.fromISO(startDateStr).startOf('day');
    const endDate = DateTime.fromISO(e.target.value).startOf('day');
    if (startDate > endDate) {
      toastWarn('종료일은 시작일과 같거나 이후로 설정해주세요.');
      setValue(endDateFieldName, enableEndDateSync ? startDateStr : null);
    }
  };

  useEffect(() => {
    const startDate = startDateStr ? DateTime.fromISO(startDateStr).startOf('day') : null;
    const endDate = endDateStr ? DateTime.fromISO(endDateStr).startOf('day') : null;
    if (!endDate) setHasDeadline(false);
    if (startDate && endDate) setHasDeadline(startDate < endDate);
  }, [startDateStr, endDateStr]);

  const handleDeadlineToggle = () => {
    setValue(endDateFieldName, enableEndDateSync ? getValues(startDateFieldName) : null);
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
            ...PERIOD_VALIDATION_RULES.START_DATE(limitStartDate, limitEndDate),
            onChange: handleStartDateChange,
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
          className={`${hasDeadline ? '' : '!bg-disable outline-none'}`}
          readOnly={!hasDeadline}
          {...register(endDateFieldName, {
            ...PERIOD_VALIDATION_RULES.END_DATE(
              hasDeadline,
              limitStartDate,
              limitEndDate,
              hasDeadline ? startDateStr : null,
            ),
            onChange: handleEndDateChange,
          })}
        />
        <div className={`my-5 h-10 grow text-xs text-error ${errors[endDateFieldName] ? 'visible' : 'invisible'}`}>
          {(errors[endDateFieldName] as FieldError | undefined)?.message}
        </div>
      </label>
    </div>
  );
}
