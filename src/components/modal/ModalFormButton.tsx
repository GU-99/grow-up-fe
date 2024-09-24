type ModalFormButtonProps = {
  formId: string;
  isCreate: boolean;
  onClose: () => void;
};

// ToDo: 삭제 작업할 때 삭제 버튼 추가할 것
// ToDo: onClose 삭제하고, onDelete로 추가할 것
export default function ModalFormButton({ formId, isCreate, onClose }: ModalFormButtonProps) {
  return (
    <div className="min-h-25 w-4/5">
      <button type="submit" form={formId} className="h-full w-full rounded-md bg-main px-10 text-white">
        {isCreate ? '등록' : '수정'}
      </button>
    </div>
  );
}
