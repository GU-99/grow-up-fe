type DndTypeKeys = keyof typeof DND_TYPE;
type DndTypeValues = (typeof DND_TYPE)[DndTypeKeys];
type DndDroppablePrefix = {
  [K in DndTypeKeys]: `${DndTypeValues}-CONTAINER`;
};

export const DND_TYPE = Object.freeze({
  STATUS: 'STATUS',
  TASK: 'TASK',
});

export const DND_DROPPABLE_PREFIX: Readonly<DndDroppablePrefix> = Object.freeze(
  Object.entries(DND_TYPE).reduce((obj, [key, value]) => {
    obj[key as DndTypeKeys] = `${value}-CONTAINER`;
    return obj;
  }, {} as DndDroppablePrefix),
);

export const DND_DRAGGABLE_PREFIX = Object.freeze({ ...DND_TYPE });
