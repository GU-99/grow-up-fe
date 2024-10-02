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
      className={`h-25 w-full rounded-md px-10 text-white outline-none ${backgroundColor} hover:brightness-90`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
