import { FormEvent, ReactNode } from 'react';

type AuthFormProps = {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function AuthForm({ children, onSubmit }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex h-screen w-300 flex-col py-30">
      <section className="h-1/6 text-large text-main">
        Welcome to our site!
        <br /> Grow Up your Life with us.
      </section>
      <section className="flex flex-grow flex-col justify-center gap-8">{children}</section>
    </form>
  );
}
