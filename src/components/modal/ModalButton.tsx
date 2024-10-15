type ModalButtonProps = React.PropsWithChildren<{
  formId?: string;
  color: 'text-white' | 'text-emphasis' | 'text-default';
  backgroundColor: 'bg-main' | 'bg-delete' | 'bg-sub' | 'bg-button' | 'bg-kakao';
  onClick?: () => void;
}>;

export default function ModalButton({ formId, color, backgroundColor, onClick, children }: ModalButtonProps) {
  const handleClick = () => onClick && onClick();

  return (
    <button
      type={formId ? 'submit' : 'button'}
      form={formId}
      className={`h-25 w-full rounded-md px-10 font-bold outline-none ${color} ${backgroundColor} hover:brightness-90`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
