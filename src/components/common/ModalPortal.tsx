import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

export default function ModalPortal({ children }: PropsWithChildren) {
  const container = document.getElementById('modal')! as HTMLDivElement;
  return createPortal(children, container);
}
