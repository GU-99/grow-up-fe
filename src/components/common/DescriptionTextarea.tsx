import { useFormContext } from 'react-hook-form';
import type { RegisterOptions } from 'react-hook-form';

type DescriptionTextareaProps = {
  id: string;
  label: string;
  fieldName: string;
  validationRole?: RegisterOptions;
  placeholder?: string;
  errors?: string;
};

export default function DescriptionTextarea({
  id,
  label,
  fieldName,
  placeholder,
  validationRole,
  errors,
}: DescriptionTextareaProps) {
  const { register } = useFormContext();

  return (
    <label htmlFor={id} className="flex flex-col">
      <h3 className="text-large">{label}</h3>
      <textarea
        id={id}
        className="w-full rounded-md border border-input p-10 text-regular placeholder:text-xs"
        placeholder={placeholder}
        rows={5}
        {...(validationRole ? register(fieldName, validationRole) : register(fieldName))}
      />
      <div className={`my-5 h-10 text-xs text-error ${errors ? 'visible' : 'invisible'}`}>{errors}</div>
    </label>
  );
}
