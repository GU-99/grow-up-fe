import { Outlet } from 'react-router-dom';
import AuthGULogo from '../assets/authGULogo.svg';

export default function AuthLayout() {
  return (
    <div className="flex flex-row justify-evenly items-center h-[100vh]">
      <img src={AuthGULogo} alt="Auth GU Logo" />
      <Outlet />
    </div>
  );
}
