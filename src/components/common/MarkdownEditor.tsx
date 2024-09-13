import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ToggleButton from '@components/common/ToggleButton';
import CustomMarkdown from '@components/common/CustomMarkdown';

type MarkdownEditorProps = {
  id: string;
  label: string;
  contentName: string;
};

export default function MarkdownEditor({ id, label, contentName }: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);
  const { watch, register } = useFormContext();

  const handlePreviewToggle = () => setPreview((prev) => !prev);

  return (
    <label htmlFor={id} className="mb-20">
      <h3 className="flex items-center space-x-2">
        <span className="text-large">{label}</span>
        <ToggleButton id="preview" checked={preview} onChange={handlePreviewToggle} />
      </h3>
      {preview ? (
        <CustomMarkdown markdown={watch(contentName)} />
      ) : (
        <textarea
          id={id}
          rows={10}
          className="w-full border border-input p-10 placeholder:text-xs"
          placeholder="마크다운 형식으로 입력해주세요."
          {...register(contentName)}
        />
      )}
    </label>
  );
}
