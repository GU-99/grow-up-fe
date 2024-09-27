import { useFormContext } from 'react-hook-form';

type DescriptionInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  errors?: string;
};

export default function DescriptionITextarea({ id, label, placeholder, errors }: DescriptionInputProps) {
  const { register } = useFormContext();

  return (
    <label htmlFor={id}>
      <h3 className="text-large">{label}</h3>
      <textarea
        id={id}
        className="h-100 w-full rounded-md border border-input p-10 text-regular placeholder:text-xs"
        placeholder={placeholder}
        {...register(id)}
      />
      <div className={`my-5 h-10 text-xs text-error ${errors ? 'visible' : 'invisible'}`}>{errors}</div>
    </label>
  );
}
