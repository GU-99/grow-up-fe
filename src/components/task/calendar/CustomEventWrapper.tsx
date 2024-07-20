import { PropsWithChildren } from 'react';
import { EventWrapperProps } from 'react-big-calendar';
import { CustomEvent } from '@/types/CustomEventType';

/**
 * ※ 특이사항
 * react-big-calendar는 DT로써 커뮤니티 차원에서 TS를 지원해주고 있습니다.
 * 문제는 커뮤니티에서 정의한 TS정의 일부가 실제와 다른 상태라 사용에 지장을 주고 있습니다.
 * 그래서 존재하지 않는 일부 속성을 제거하고, 실제로 넘겨주는 속성을 추가하는 작업을 추가했습니다.
 *
 * 존재하지 않는 속성: continuesEarlier, continuesLater
 * 실제로 주는 속성: continuesPrior, continuesAfter
 */
type CustomEventWrapperProps = PropsWithChildren<
  Pick<
    EventWrapperProps<CustomEvent>,
    Exclude<keyof EventWrapperProps<CustomEvent>, 'continuesEarlier' | 'continuesLater'>
  > & { continuesPrior: boolean; continuesAfter: boolean }
>;

export default function CustomEventWrapper(props: EventWrapperProps<CustomEvent>) {
  const { children, event, continuesPrior, continuesAfter } = props as unknown as CustomEventWrapperProps;

  let continuesClass = '';
  if (continuesPrior) continuesClass = 'rbc-event-continues-prior';
  if (continuesAfter) continuesClass = 'rbc-event-continues-after';

  return (
    <div
      style={{ backgroundColor: event.task.color }}
      className={`overflow-hidden text-ellipsis rounded-md px-3 py-1 ${continuesClass}`}
    >
      {children}
    </div>
  );
}
