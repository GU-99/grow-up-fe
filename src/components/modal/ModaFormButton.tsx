type ModalButtonProps = {
  formId: string;
  isCreate: boolean;
  onClose: () => void;
};

export default function ModaFormButton({ formId, isCreate, onClose }: ModalButtonProps) {
  return (
    <div className="h-20">
      <button type="submit" form={formId} className="mr-10 h-full rounded-md bg-main px-10 text-white">
        {isCreate ? '등록' : '수정'}
      </button>
      <button type="button" className="h-full rounded-md bg-button px-10" onClick={onClose}>
        닫기
      </button>
    </div>
  );
}
