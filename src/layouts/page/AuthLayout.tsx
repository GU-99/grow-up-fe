import { Outlet } from 'react-router-dom';
import AuthGULogo from '@/assets/auth_logo.svg';

export default function AuthLayout() {
  return (
    <div className="flex h-screen flex-row items-center justify-evenly bg-main">
      <img src={AuthGULogo} alt="Auth GU Logo" />
      <main className="flex h-[90vh] flex-col overflow-y-scroll rounded-2xl bg-[white] p-30 scrollbar-hide">
        <Outlet />
      </main>
    </div>
  );
}
