import { SubmitHandler, useForm } from 'react-hook-form';
import { PROJECT_STATUS_COLORS } from '@constants/projectStatus';
import { STATUS_VALIDATION_RULES } from '@constants/formValidationRules';
import { GiCheckMark } from 'react-icons/gi';
import { RiProhibited2Fill, RiProhibited2Line } from 'react-icons/ri';
import type { ColorInfo, ProjectStatus, ProjectStatusForm } from '@/types/ProjectStatusType';

type ModalProjectStatusFormProps = {
  formId: string;
  projectStatus: ProjectStatus[];
  onSubmit: SubmitHandler<ProjectStatusForm>;
};

// 색상 정보 취득
function getProjectColors(projectStatus: ProjectStatus[]): ColorInfo[] {
  const colorMap = new Map();
  Object.values(PROJECT_STATUS_COLORS).forEach((color) => {
    colorMap.set(color, { color, isUsable: true });
  });

  projectStatus.forEach(({ color }) => {
    if (!colorMap.has(color)) throw Error('[Error] 등록되지 않은 색상입니다.');
    colorMap.set(color, { ...colorMap.get(color), isUsable: false });
  });

  return [...colorMap.values()];
}

export default function ModalProjectStatusForm({ formId, projectStatus, onSubmit }: ModalProjectStatusFormProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectStatusForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      color: '',
    },
  });
  const statusName = watch('name');
  const selectedColor = watch('color');

  const colorList = getProjectColors(projectStatus);
  const nameList = projectStatus.map((status) => status.name);
  const colorNameList = projectStatus.map((status) => status.color);

  return (
    <form id={formId} className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
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
        {colorList.map(({ color, isUsable }, index) => (
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
          </div>
        ))}
      </section>
      {errors.color && <div className="mt-5 text-xs text-error">{errors.color.message}</div>}
    </form>
  );
}
