import { UseFormRegisterReturn } from 'react-hook-form';

type DescriptionInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  errors?: string;
  register?: UseFormRegisterReturn;
};

export default function DescriptionInput({ id, label, placeholder, errors, register }: DescriptionInputProps) {
  return (
    <label htmlFor={id}>
      <h3 className="text-large">{label}</h3>
      <textarea
        id={id}
        className="h-100 w-full rounded-md border border-input p-10 text-regular placeholder:text-xs"
        placeholder={placeholder}
        {...register}
      />
      <div className={`my-5 h-10 text-xs text-error ${errors ? 'visible' : 'invisible'}`}>{errors}</div>
    </label>
  );
}
