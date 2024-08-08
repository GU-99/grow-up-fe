import type { ReactNode } from 'react';

type ListSidebarProps = {
  label?: string;
  title: string;
  children?: ReactNode;
  showButton?: boolean;
  text?: string;
  onClick?: () => void;
};

// ToDo: 프로젝트 생성 등과 같은 버튼 기능 추가할 것
export default function ListSidebar({ label, title, children, showButton, text, onClick }: ListSidebarProps) {
  return (
    <aside className="mr-10 flex w-1/3 flex-col border border-list bg-contents-box">
      <div className="flex min-h-30 items-center justify-between bg-sub px-10">
        <div>
          {label && <small className="mr-5 font-bold text-main">{label}</small>}
          <span className="text-emphasis">{title}</span>
        </div>
        {/* 팀 생성 모달 */}
        {showButton && (
          <button
            type="button"
            className="rounded-md bg-main px-4 py-2 text-white outline-none hover:brightness-90"
            onClick={onClick}
          >
            {text}
          </button>
        )}
      </div>
      {children}
    </aside>
  );
}
