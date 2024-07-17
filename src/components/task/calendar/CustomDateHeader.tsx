import { DateHeaderProps } from 'react-big-calendar';

// ToDo: Header 컴포넌트 수정할 것
export default function CustomDateHeader({ date, drilldownView, isOffRange, label, onDrillDown }: DateHeaderProps) {
  console.log(date, drilldownView, isOffRange, label, onDrillDown);
  console.log(date.getDate());
  return <div>{date.getDate()}</div>;
}
