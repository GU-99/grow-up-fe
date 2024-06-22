import { Outlet } from 'react-router-dom';
import AuthGULogo from '@/assets/authGULogo.svg';

export default function AuthLayout() {
  return (
    <div className="flex h-[100vh] flex-row items-center justify-evenly">
      <img src={AuthGULogo} alt="Auth GU Logo" />
      <Outlet />
    </div>
  );
}
