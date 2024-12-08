import { useEffect } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';

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

  const handleCloseClick = () => onClose();

  return (
    <section
      className="absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center bg-black/50"
      tabIndex={-1}
    >
      <article className="flex h-4/5 max-h-375 w-375 flex-col items-center overflow-auto bg-white p-20">
        <header className="flex w-full justify-end">
          <IoMdCloseCircle
            className="size-12 cursor-pointer text-close hover:text-[#DF0000]"
            onClick={handleCloseClick}
          />
        </header>
        <div className="flex w-full grow flex-col items-center *:w-4/5">{children}</div>
      </article>
    </section>
  );
}
