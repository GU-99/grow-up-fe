import { useCallback, useMemo, useState } from 'react';
import { DateTime, Settings } from 'luxon';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';
import DetailModalTask from '@components/modal/task/DetailModalTask';
import UpdateModalTask from '@components/modal/task/UpdateModalTask';
import CalendarToolbar from '@components/task/calendar/CalendarToolbar';
import CustomDateHeader from '@components/task/calendar/CustomDateHeader';
import CustomEventWrapper from '@components/task/calendar/CustomEventWrapper';
import useModal from '@hooks/useModal';
import useProjectContext from '@hooks/useProjectContext';
import { useReadStatusTasks } from '@hooks/query/useTaskQuery';
import Validator from '@utils/Validator';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/customReactBigCalendar.css';

import type { DayPropGetter, EventPropGetter } from 'react-big-calendar';
import type { Task, TaskListWithStatus, TaskWithStatus } from '@/types/TaskType';
import type { CustomEvent } from '@/types/CustomEventType';

function getCalendarTask(statusTasks: TaskListWithStatus[]) {
  const calendarTasks: TaskWithStatus[] = [];

  statusTasks.forEach((statusTask) => {
    const { statusName, colorCode, sortOrder: statusOrder, tasks } = statusTask;
    tasks.forEach((task) => {
      calendarTasks.push({ statusName, colorCode, statusOrder, ...task });
    });
  });

  return calendarTasks;
}

const dt = DateTime.local();
Settings.defaultZone = dt.zoneName;
const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 7 });

// ToDo: Loading시 infinite spinner UI 보이도록 변경할 것
// ToDo: Error 발생시 처리 추가할 것
export default function CalendarPage() {
  const [selectedTask, setSelectedTask] = useState<Task>({
    taskId: 0,
    statusId: 0,
    name: '',
    content: '',
    startDate: '',
    endDate: '',
    sortOrder: 0,
  });
  const [date, setDate] = useState<Date>(() => DateTime.now().toJSDate());
  const { project } = useProjectContext();
  const { statusTaskList, isTaskLoading, isTaskError, taskError } = useReadStatusTasks(project.projectId);
  const { showModal: showDetailModal, openModal: openDetailModal, closeModal: closeDetailModal } = useModal();
  const { showModal: showUpdateModal, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();

  const handleNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);

  const handleSelectEvent = (event: CustomEvent) => {
    const { taskId, statusId, name, content, startDate, endDate, sortOrder } = event.task;
    const task: Task = { taskId, statusId, name, content, startDate, endDate, sortOrder };
    setSelectedTask(task);
    openDetailModal();
  };

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    alert(`시작일: ${start}, 마감일: ${end}`);
  }, []);

  const handleDayPropGetter: DayPropGetter = (targetDate) => {
    if (!project.startDate || !project.endDate) return {};

    const isWithinRange = Validator.isWithinDateRange(project.startDate, project.endDate, targetDate);
    const bgColor = isWithinRange ? '' : '!bg-[#D9D9D9]';
    return { className: bgColor };
  };
  const handleEventPropGetter: EventPropGetter<CustomEvent> = () => ({
    style: { padding: '0px', backgroundColor: 'inherit' },
  });

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
    events: getCalendarTask(statusTaskList)
      .map((task) => ({
        title: task.name,
        start: new Date(task.startDate),
        end: new Date(task.endDate),
        allDays: true,
        task: { ...task },
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime()),
  };
  const startDate = state.events.length ? state.events[0].start : null;

  // ToDo: DnD, Resize 이벤트 추가 생각해보기
  // ToDo: 할일 추가 모달 Form 작업 완료시 모달 컴포넌트 분리
  // ToDo: 캘린더 크기 전체적으로 조정
  // ToDo: 코드 리팩토링
  return (
    <div className="flex h-full min-h-375 w-full min-w-260 flex-col">
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
        showAllEvents={false}
        dayPropGetter={handleDayPropGetter}
        eventPropGetter={handleEventPropGetter}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      {showDetailModal && (
        <DetailModalTask
          project={project}
          task={selectedTask}
          openUpdateModal={openUpdateModal}
          onClose={closeDetailModal}
        />
      )}
      {showUpdateModal && <UpdateModalTask project={project} taskId={selectedTask.taskId} onClose={closeUpdateModal} />}
    </div>
  );
}
