import { FormEvent, ReactNode } from 'react';

type AuthFormLayoutProps = {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  marginTop: 'mt-34.9' | 'mt-40';
};

export default function AuthFormLayout({ children, onSubmit, marginTop }: AuthFormLayoutProps) {
  return (
    <>
      <section className="mt-40 text-large text-main">
        Welcome to our site!
        <br />
        Grow Up your Life with us.
      </section>
      <form onSubmit={onSubmit} className={`flex h-screen w-300 flex-col justify-center gap-8 py-30 ${marginTop}`}>
        {children}
      </form>
    </>
  );
}
