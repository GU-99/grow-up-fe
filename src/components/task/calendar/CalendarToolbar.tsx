import { useMemo } from 'react';
import { DateTime } from 'luxon';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { Project } from '@/types/ProjectType';

type CalendarToolbarProp = {
  date: Date;
  startDate: Project['startDate'];
  onClick: (date: Date) => void;
};

export default function CalendarToolbar({ date, startDate, onClick }: CalendarToolbarProp) {
  const { year, month } = useMemo(() => DateTime.fromJSDate(date), [date]);

  const handlePrevMonthClick = () => {
    const prevMonthDate = DateTime.fromJSDate(date).minus({ month: 1 }).toJSDate();
    onClick(prevMonthDate);
  };
  const handlePrevYearClick = () => {
    const prevYearDate = DateTime.fromJSDate(date).minus({ year: 1 }).toJSDate();
    onClick(prevYearDate);
  };
  const handleNextMonthClick = () => {
    const nextMonthDate = DateTime.fromJSDate(date).plus({ month: 1 }).toJSDate();
    onClick(nextMonthDate);
  };
  const handleNextYearClick = () => {
    const nextYearDate = DateTime.fromJSDate(date).plus({ year: 1 }).toJSDate();
    onClick(nextYearDate);
  };
  const handleTodayClick = () => {
    const todayDate = DateTime.now().toJSDate();
    onClick(todayDate);
  };

  // ToDo: startDate가 없을 수도 있구나... 그럼 첫태스크가 있는 곳으로 보내야하나
  const handleStartDayClick = () => {
    if (startDate === null) return;
    const projectStartDate = DateTime.fromJSDate(startDate).toJSDate();
    onClick(projectStartDate);
  };

  return (
    <section className="flex h-30 flex-wrap items-center justify-center bg-main px-10 *:w-1/3">
      <div />
      <div className="flex items-center justify-center text-center font-bold text-white">
        <button type="button" aria-label="이전 연도" onClick={handlePrevYearClick}>
          <MdKeyboardDoubleArrowLeft />
        </button>
        <button type="button" aria-label="이전 달" onClick={handlePrevMonthClick}>
          <MdKeyboardArrowLeft />
        </button>
        <span className="mx-10">
          {year}년 {month}월
        </span>
        <button type="button" aria-label="다음 달" onClick={handleNextMonthClick}>
          <MdKeyboardArrowRight />
        </button>
        <button type="button" aria-label="다음 연도" onClick={handleNextYearClick}>
          <MdKeyboardDoubleArrowRight />
        </button>
      </div>
      <div className="text-right text-emphasis *:ml-5">
        <button
          type="button"
          className="px-8hover:brightness-90 box-border h-20 w-50 rounded-lg bg-button"
          onClick={handleStartDayClick}
        >
          시작일
        </button>
        <button
          type="button"
          className="box-border h-20 w-50 rounded-lg bg-button px-8 hover:brightness-90"
          onClick={handleTodayClick}
        >
          당일
        </button>
      </div>
    </section>
  );
}
