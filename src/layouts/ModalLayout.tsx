import { useEffect } from 'react';

type ModalLayoutProps = {
  onClose: () => void;
  children?: React.ReactNode | undefined;
};

export default function ModalLayout({ onClose, children }: ModalLayoutProps) {
  const handleKeyDownClose = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'escape') onClose();
  };

  useEffect(() => {
    globalThis.addEventListener('keydown', handleKeyDownClose);
    return () => globalThis.removeEventListener('keydown', handleKeyDownClose);
  }, []);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center bg-black/50"
      tabIndex={-1}
    >
      <div className="flex h-4/5 max-h-375 min-w-375 flex-col items-center overflow-auto bg-white p-20">{children}</div>
    </div>
  );
}
