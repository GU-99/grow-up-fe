import { Outlet } from 'react-router-dom';
import AuthGULogo from '@/assets/auth_logo.svg';

export default function AuthLayout() {
  return (
    <div className="flex h-[100vh] flex-row items-center justify-evenly bg-main">
      <img src={AuthGULogo} alt="Auth GU Logo" />
      <Outlet />
    </div>
  );
}
