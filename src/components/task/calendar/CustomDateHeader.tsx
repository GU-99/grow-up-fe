import { DateTime } from 'luxon';
import { DateHeaderProps } from 'react-big-calendar';
import { LuxonWeekday } from '@constants/date';
import useProjectContext from '@hooks/useProjectContext';
import Validator from '@utils/Validator';

function getTextColor(weekday: LuxonWeekday, isWithinRange: boolean) {
  if (!isWithinRange) return 'text-[#999999]';

  switch (weekday) {
    case LuxonWeekday.SATURDAY:
      return 'text-[#000AFF]';
    case LuxonWeekday.SUNDAY:
      return 'text-[#FF0000]';
    default:
      return 'text-default';
  }
}

export default function CustomDateHeader({ date, label }: DateHeaderProps) {
  const { project } = useProjectContext();

  // prettier-ignore
  const isWithinDateRange = project.startDate && project.endDate
      ? Validator.isWithinDateRange(project.startDate, project.endDate, date)
      : true;

  const { weekday } = DateTime.fromJSDate(date);
  const textColor = getTextColor(weekday, isWithinDateRange);

  return <div className={`pl-3 text-left ${textColor}`}>{label.padStart(2, '0')}</div>;
}
