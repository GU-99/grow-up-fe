import { GiCheckMark } from 'react-icons/gi';
import { IoIosClose } from 'react-icons/io';
import { RiProhibited2Fill, RiProhibited2Line } from 'react-icons/ri';
import { SubmitHandler, useForm } from 'react-hook-form';
import { STATUS_VALIDATION_RULES } from '@constants/formValidationRules';
import type { TodoStatus, TodoStatusFormValues } from '@/types/TodoStatusType';

type TodoProps = {
  todoStatus: TodoStatus[];
  onClose: () => void;
};

const DEFAULT_TODO_COLORS = Object.freeze({
  RED: '#c83c00',
  YELLOW: '#dab700',
  GREEN: '#237700',
  BLUE: '#00c2ff',
  ORANGE: '#ff7a00',
  PURPLE: '#db00ff',
  PINK: '#ff0099',
  YELLO_GREEN: '#8fff00',
});

// 색상 정보 취득
function getTodoColors(todoStatus: TodoStatus[]) {
  const colorMap = new Map();

  Object.values(DEFAULT_TODO_COLORS).forEach((color) =>
    colorMap.set(color, { color, isDefault: true, isUsable: true }),
  );

  todoStatus.forEach(({ color }) => {
    const colorStatusInfo = colorMap.has(color)
      ? { ...colorMap.get(color), isUsable: false }
      : { color, isDefault: false, isUsable: false };
    colorMap.set(color, colorStatusInfo);
  });

  return [...colorMap.values()];
}

export default function ModalTodoStatus({ todoStatus, onClose }: TodoProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoStatusFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      color: '',
    },
  });
  const statusName = watch('name');
  const selectedColor = watch('color');

  // ToDo: useMemo, useCallback 고려해보기
  const colorList = getTodoColors(todoStatus);
  const nameList = todoStatus.map((status) => status.name);
  const colorNameList = todoStatus.map((status) => status.color);

  const handleClickDelete = (color: string) => {
    // ToDo: 색상 삭제시 등록된 할일 목록이 있는지 확인하는 로직 추가
    // ToDo: 색상 삭제를 위한 네트워크 로직 추가
    console.log(`${color} 삭제`);
  };

  const onSubmit: SubmitHandler<TodoStatusFormValues> = async (data) => {
    // ToDo: 색상 생성을 위한 네트워크 로직 추가
    console.log(data);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <form id="statusForm" className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="mb-10">
          <h3 className="text-large">상태명</h3>
          <div className="relative">
            <input
              type="text"
              id="name"
              className="h-25 w-200 rounded-md border border-input pl-10 pr-25 text-regular placeholder:text-xs"
              placeholder="상태명을 입력하세요."
              {...register('name', STATUS_VALIDATION_RULES.STATUS_NAME(nameList))}
            />
            {statusName && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                {errors.name ? (
                  <RiProhibited2Line className="size-10 text-error" />
                ) : (
                  <GiCheckMark className="size-10 text-main" />
                )}
              </div>
            )}
          </div>
          {errors.name && <div className="mt-5 text-xs text-error">{errors.name.message}</div>}
        </label>
        <h3 className="text-large">색상</h3>
        <section className="grid grid-cols-8 gap-4">
          {colorList.map(({ color, isUsable, isDefault }, index) => (
            <div className="group relative m-auto" key={index}>
              <label
                htmlFor={color}
                style={{ backgroundColor: color }}
                className={`realative inline-block size-20 cursor-pointer rounded-full ${selectedColor === color ? 'border-4 border-selected' : ''}`}
              >
                <input
                  type="radio"
                  id={color}
                  value={color}
                  className="hidden"
                  disabled={!isUsable}
                  {...register('color', STATUS_VALIDATION_RULES.COLOR(colorNameList))}
                />
                {!isUsable && <RiProhibited2Fill className="size-20 text-white" />}
              </label>
              {!isDefault && (
                <button
                  type="button"
                  aria-label="delete-color"
                  className="invisible absolute right-0 top-0 cursor-pointer rounded-full border border-white bg-close hover:brightness-125 group-hover:visible"
                  onClick={() => handleClickDelete(color)}
                >
                  <IoIosClose className="size-8 text-white" />
                </button>
              )}
            </div>
          ))}
        </section>
        {errors.color && <div className="mt-5 text-xs text-error">{errors.color.message}</div>}
      </form>
      <div className="h-20">
        <button type="submit" form="statusForm" className="mr-10 h-20 rounded-md bg-main px-10 text-white">
          등록
        </button>
        <button type="button" className="h-20 rounded-md bg-button px-10" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
