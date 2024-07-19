import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { DateHeaderProps } from 'react-big-calendar';
import { LuxonWeekday } from '@constants/date';

function getTextColor(weekday: LuxonWeekday, isOffRange: boolean) {
  if (isOffRange) return 'text-[#999999]';

  switch (weekday) {
    case LuxonWeekday.SATURDAY:
      return 'text-[#000AFF]';
    case LuxonWeekday.SUNDAY:
      return 'text-[#FF0000]';
    default:
      return 'text-default';
  }
}

export default function CustomDateHeader({ date, isOffRange }: DateHeaderProps) {
  const { weekday } = useMemo(() => DateTime.fromJSDate(date), [date]);
  const textColor = useMemo(() => getTextColor(weekday, isOffRange), [weekday, isOffRange]);

  return <div className={`pl-3 text-left ${textColor}`}>{date.getDate()}</div>;
}
