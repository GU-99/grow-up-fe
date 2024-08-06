import { UseFormRegisterReturn } from 'react-hook-form';
import { GiCheckMark } from 'react-icons/gi';
import { RiProhibited2Line } from 'react-icons/ri';

type DuplicationCheckInputProp = {
  id: string;
  label?: string;
  value: string;
  placeholder?: string;
  errors?: string;
  register?: UseFormRegisterReturn;
};

export default function DuplicationCheckInput({
  id,
  label,
  value,
  placeholder,
  errors,
  register,
}: DuplicationCheckInputProp) {
  return (
    <label htmlFor={id}>
      {label && <h3 className="text-large">{label}</h3>}
      <div className="relative">
        <input
          type="text"
          id={id}
          className="h-25 w-full min-w-200 rounded-md border border-input pl-10 pr-25 text-regular placeholder:text-xs"
          placeholder={placeholder}
          {...register}
        />
        {value && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            {errors ? (
              <RiProhibited2Line className="size-10 text-error" />
            ) : (
              <GiCheckMark className="size-10 text-main" />
            )}
          </div>
        )}
      </div>
      <div className={`my-5 h-10 text-xs text-error ${errors ? 'visible' : 'invisible'}`}>{errors}</div>
    </label>
  );
}
