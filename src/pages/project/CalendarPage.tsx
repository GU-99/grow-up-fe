import { useCallback, useMemo, useState } from 'react';
import { DateTime, Settings } from 'luxon';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';
import CalendarToolbar from '@components/task/calendar/CalendarToolbar';
import CustomDateHeader from '@components/task/calendar/CustomDateHeader';
import CustomEventWrapper from '@components/task/calendar/CustomEventWrapper';
import useModal from '@hooks/useModal';
import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModaFormButton from '@components/modal/ModaFormButton';
import { TASK_DUMMY } from '@mocks/mockData';
import { TaskListWithStatus, TaskWithStatus } from '@/types/TaskType';
import { CustomEvent } from '@/types/CustomEventType';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function getCalendarTask(statusTasks: TaskListWithStatus[]) {
  const calendarTasks: TaskWithStatus[] = [];

  statusTasks.forEach((statusTask) => {
    const { statusId, name: statusName, color, order: statusOrder, tasks } = statusTask;
    tasks.forEach((task) => {
      calendarTasks.push({ statusId, statusName, color, statusOrder, ...task });
    });
  });

  return calendarTasks;
}

const dt = DateTime.local();
Settings.defaultZone = dt.zoneName;
const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 7 });

export default function CalendarPage() {
  const { showModal, openModal, closeModal } = useModal();
  const [selectedTask, setSelectedTask] = useState<TaskWithStatus>();
  const [date, setDate] = useState<Date>(() => DateTime.now().toJSDate());

  const handleNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);

  const handleEventClick = (task: TaskWithStatus) => {
    setSelectedTask(task);
    openModal();
  };

  const handleSelectEvent = (event: CustomEvent) => {
    setSelectedTask(event?.task);
    openModal();
  };

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    alert(`시작일: ${start}, 마감일: ${end}`);
  }, []);

  const handleEventPropGetter = () => ({ style: { padding: '0px', backgroundColor: 'inherit' } });

  const { views, components: customComponents } = useMemo(
    () => ({
      views: [Views.MONTH],
      components: {
        eventWrapper: CustomEventWrapper,
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
      .map((task) => ({
        title: task.name,
        start: new Date(task.startDate),
        end: new Date(task.endDate),
        allDays: true,
        task: { ...task },
        handleEventClick,
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime()),
  };
  const startDate = state.events.length ? state.events[0].start : null;

  // ToDo: 프로젝트 기간 이외의 영역 처리
  // ToDo: DnD, Resize 이벤트 추가 생각해보기
  // ToDo: 할일 추가 모달 Form 작업 완료시 모달 컴포넌트 분리
  // ToDo: 캘린더 크기 전체적으로 조정
  // ToDo: 코드 리팩토링
  return (
    <div className="flex h-full min-h-375 min-w-260 flex-col">
      <CalendarToolbar date={date} startDate={startDate} onClick={handleNavigate} />
      <Calendar
        toolbar={false}
        localizer={localizer}
        defaultView="month"
        date={date}
        onNavigate={handleNavigate}
        drilldownView={null}
        views={views}
        events={state.events}
        components={customComponents}
        titleAccessor="title"
        startAccessor="start"
        endAccessor="end"
        allDayAccessor="allDay"
        popup
        onSelectEvent={handleSelectEvent}
        showAllEvents={false}
        eventPropGetter={handleEventPropGetter}
        selectable
        onSelectSlot={handleSelectSlot}
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
