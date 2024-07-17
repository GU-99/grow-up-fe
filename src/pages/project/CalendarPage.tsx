import { useCallback, useMemo, useState } from 'react';
import { DateTime, Settings } from 'luxon';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';
import CalendarToolbar from '@components/task/calendar/CalendarToolbar';
import CustomEvent, { CustomEvents } from '@components/task/calendar/CustomEvent';
import CustomDateHeader from '@components/task/calendar/CustomDateHeader';
import useModal from '@hooks/useModal';
import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModaFormButton from '@components/modal/ModaFormButton';
import { TASK_DUMMY } from '@mocks/mockData';
import { TaskListWithStatus, TaskWithStatus } from '@/types/TaskType';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function getCalendarTask(statusTasks: TaskListWithStatus[]) {
  const calendarTasks: TaskWithStatus[] = [];

  statusTasks.forEach((statusTask) => {
    const { statusId, name: statusName, color, order: statusOrder, tasks } = statusTask;
    tasks.forEach((task) => {
      calendarTasks.push({ statusId, statusName, color, statusOrder, ...task });
    });
  });
  console.log(calendarTasks);

  return calendarTasks;
}

const dt = DateTime.local();
Settings.defaultZone = dt.zoneName;
const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 7 });

export default function CalendarPage() {
  const { showModal, openModal, closeModal } = useModal();
  const [selectedTask, setSelectedTask] = useState<TaskWithStatus>();
  const [date, setDate] = useState<Date>(() => DateTime.now().toJSDate());

  const handleToolbarClick = (date: Date) => setDate(date);

  const handleEventClick = (task: TaskWithStatus) => {
    setSelectedTask(task);
    openModal();
  };

  const handleSelectEvent = (event: CustomEvents) => {
    setSelectedTask(event?.task);
    openModal();
  };

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    console.log(`시작일: ${start}, 마감일: ${end}`);
    alert('날짜가 선택되었어요!');
  }, []);

  const { views, components: customComponents } = useMemo(
    () => ({
      views: [Views.MONTH, Views.WEEK],
      components: {
        event: CustomEvent,
        month: {
          header: () => undefined,
          dateHeader: CustomDateHeader,
        },
      },
    }),
    [],
  );

  const state = {
    events: getCalendarTask(TASK_DUMMY)
      .map((statusTask) => ({
        title: statusTask.name,
        start: new Date(statusTask.startDate),
        end: new Date(statusTask.endDate),
        allDays: true,
        task: { ...statusTask },
        handleEventClick,
      }))
      .sort((a, b) => a.start.getTime() - b.end.getTime()),
  };

  // ToDo: 캘린더 스타일 변경을 위해 커스텀 컴포넌트 추가
  // ToDo: DnD, Resize 이벤트 추가 생각해보기
  // ToDo: 할일 추가 모달 Form 작업 완료시 모달 컴포넌트 분리
  // ToDo: react-big-calendar CSS overwrite
  // ToDo: onNavigate로 발생하는 warning 해결
  // ToDo: 캘린더 크기 전체적으로 조정
  // ToDo: 코드 리팩토링
  return (
    <div className="min-h-375 min-w-375 grow">
      <CalendarToolbar date={date} startDate={state.events[0].start} onClick={handleToolbarClick} />
      <Calendar
        toolbar={false}
        localizer={localizer}
        defaultView="month"
        date={date}
        views={views}
        events={state.events}
        components={customComponents}
        titleAccessor="title"
        startAccessor="start"
        endAccessor="end"
        allDayAccessor="allDay"
        popup
        onSelectEvent={handleSelectEvent}
        // selectable
        // onSelectSlot={handleSelectSlot}
      />
      {showModal && (
        <ModalPortal>
          <ModalLayout onClose={closeModal}>
            <div className="flex h-full flex-col items-center justify-center">
              <div>{selectedTask?.name}</div>
              <ModaFormButton formId="updateStatusForm" isCreate={false} onClose={closeModal} />
            </div>
          </ModalLayout>
        </ModalPortal>
      )}
    </div>
  );
}
