type ModalFormButtonProps = {
  formId: string;
  isCreate: boolean;
  onClose: () => void;
};

export default function ModalFormButton({ formId, isCreate, onClose }: ModalFormButtonProps) {
  return (
    <div className="min-h-25 w-4/5">
      <button type="submit" form={formId} className="mr-10 h-full w-full rounded-md bg-main px-10 text-white">
        {isCreate ? '등록' : '수정'}
      </button>
    </div>
  );
}
