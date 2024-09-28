import { GoPlusCircle } from 'react-icons/go';
import { IoMdCloseCircle } from 'react-icons/io';
import type { FileInfo } from '@/types/FileType';

type FileDropZoneProps = {
  id: string;
  label: string;
  files: FileInfo[];
  accept: string;
  onFileDrop: (e: React.DragEvent<HTMLElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDeleteClick: (fileId: string) => void;
};

const DEFAULT_BG_COLOR = 'inherit';
const FILE_DRAG_OVER_BG_COLOR = '#e1f4d9';

export default function FileDropZone({
  id,
  label,
  files,
  accept = '*',
  onFileDrop,
  onFileChange: handleFileChange,
  onFileDeleteClick: handleFileDeleteClick,
}: FileDropZoneProps) {
  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return;
    e.currentTarget.style.backgroundColor = DEFAULT_BG_COLOR;
  };
  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = FILE_DRAG_OVER_BG_COLOR;
  };

  const handleFileDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = DEFAULT_BG_COLOR;
    onFileDrop(e);
  };

  return (
    <label htmlFor={id}>
      <h3 className="text-large">{label}</h3>
      <input
        id={id}
        type="file"
        accept={accept}
        className="h-0 w-0 opacity-0"
        onChange={handleFileChange}
        multiple
        hidden
      />
      <div
        role="button"
        tabIndex={0}
        className="flex cursor-pointer items-center gap-4 rounded-sl border-2 border-dashed border-input p-10 transition duration-100"
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleFileDrop}
        aria-label="파일을 이 영역에 드래그하거나 클릭하여 업로드하세요"
      >
        <ul className="flex grow flex-wrap gap-4">
          {files.map(({ fileId, fileName }) => (
            <li key={fileId} className="flex items-center gap-4 rounded-md bg-button px-4 py-2">
              <span>{fileName}</span>
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
      </div>
    </label>
  );
}
