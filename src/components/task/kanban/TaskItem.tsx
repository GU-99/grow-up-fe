import { Draggable, DraggableId } from '@hello-pangea/dnd';

type TaskItemProps = {
  draggableId: DraggableId;
  name: string;
  colorCode: string;
  index: number;
};

export default function TaskItem({ draggableId, name, colorCode, index }: TaskItemProps) {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(dragProvided) => (
        <div
          className="m-5 flex h-30 items-center justify-start gap-5 rounded-sl bg-[#FEFEFE] p-5"
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
        >
          <div style={{ borderColor: colorCode }} className="h-8 w-8 rounded-full border" />
          <div className="select-none overflow-hidden text-ellipsis text-nowrap">{name}</div>
        </div>
      )}
    </Draggable>
  );
}
