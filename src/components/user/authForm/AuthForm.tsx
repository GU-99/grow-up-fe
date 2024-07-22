import { FormEvent, ReactNode } from 'react';

type AuthFormProps = {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  styles?: string;
};

export default function AuthForm({ children, onSubmit, styles }: AuthFormProps) {
  return (
    <>
      <section className="mt-40 text-large text-main">
        Welcome to our site!
        <br />
        Grow Up your Life with us.
      </section>
      <form onSubmit={onSubmit} className={`${styles} flex h-screen w-300 flex-col justify-center gap-8 py-30`}>
        {children}
      </form>
    </>
  );
}
