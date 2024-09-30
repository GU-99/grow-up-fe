type ModalButtonProps = React.PropsWithChildren<{
  formId?: string;
  backgroundColor: 'bg-main' | 'bg-delete' | 'bg-sub' | 'bg-button' | 'bg-kakao';
  onClick?: () => void;
}>;

export default function ModalButton({ formId, backgroundColor, onClick, children }: ModalButtonProps) {
  const handleClick = () => onClick && onClick();

  return (
    <button
      type={formId ? 'submit' : 'button'}
      form={formId}
      className={`h-full w-full rounded-md px-10 text-white ${backgroundColor}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
