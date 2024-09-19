import { GoPlusCircle } from 'react-icons/go';
import { IoMdCloseCircle } from 'react-icons/io';
import type { CustomFile } from '@/types/FileType';

type FileDropZoneProps = {
  id: string;
  label: string;
  files: CustomFile[];
  onFileDrop: (e: React.DragEvent<HTMLElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDeleteClick: (fileId: string) => void;
};

// ToDo: 파일 업로드 API 작업시 구조 다시 한 번 확인해보기
export default function FileDropZone({
  id,
  label,
  files,
  onFileDrop,
  onFileChange: handleFileChange,
  onFileDeleteClick: handleFileDeleteClick,
}: FileDropZoneProps) {
  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return;
    e.currentTarget.style.backgroundColor = 'inherit';
  };
  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '#e1f4d9';
  };

  const handleFileDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = 'inherit';
    onFileDrop(e);
  };

  return (
    <label htmlFor={id}>
      <h3 className="text-large">{label}</h3>
      <input type="file" id={id} className="h-0 w-0 opacity-0" multiple hidden onChange={handleFileChange} />
      <section
        className="flex cursor-pointer items-center gap-4 rounded-sl border-2 border-dashed border-input p-10 transition duration-100"
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleFileDrop}
      >
        <ul className="flex grow flex-wrap gap-4">
          {files.map(({ id, file }) => (
            <li key={id} className="flex items-center gap-4 rounded-md bg-button px-4 py-2">
              <span>{file.name}</span>
              <IoMdCloseCircle
                className="text-close"
                onClick={(e: React.MouseEvent<HTMLOrSVGElement>) => {
                  e.preventDefault();
                  handleFileDeleteClick(id);
                }}
              />
            </li>
          ))}
        </ul>
        <div>
          <GoPlusCircle className="size-15 text-[#5E5E5E]" />
        </div>
      </section>
    </label>
  );
}
