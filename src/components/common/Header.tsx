import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '@assets/logo.svg';
import { FaUserCircle } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';
import { useStore } from '@stores/useStore';
import { logout } from '@services/authService';
import useToast from '@hooks/useToast';

export default function Header() {
  const { userInfo: userInfoData, onLogout, clearUserInfo, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const { toastSuccess } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
      clearUserInfo();
      navigate('/signin', { replace: true });
      setTimeout(() => {
        toastSuccess('로그아웃이 완료되었습니다.');
      }, 100);
    } catch (error) {
      console.error('로그아웃 도중 에러가 발생했습니다.');
    }
  };

  return (
    <header className="flex h-header items-center justify-between bg-main px-15">
      <div>
        <Link to="/" className="hover:brightness-90">
          <img className="size-30 select-none" src={logo} alt="GrowUp Logo" />
        </Link>
      </div>
      <nav className="flex items-center">
        {isAuthenticated && (
          <div className="tracking-tight text-white">{userInfoData.nickname}님의 Grow Up! 응원합니다.</div>
        )}
        <NavLink to="/" className="ml-10 hover:brightness-90">
          {({ isActive }) => <FiHome className={`size-20 ${isActive ? 'text-selected' : 'text-white'}`} />}
        </NavLink>
        <NavLink to="/setting/user" className="ml-10 hover:brightness-90">
          {({ isActive }) => <FaUserCircle className={`size-20 ${isActive ? 'text-selected' : 'text-white'}`} />}
        </NavLink>
        <button
          type="button"
          className="ml-10 h-20 rounded-md bg-white px-4 tracking-tight hover:brightness-90"
          onClick={isAuthenticated ? handleLogout : () => navigate('/signin')}
        >
          {isAuthenticated ? 'Logout' : 'Login'}
        </button>
      </nav>
    </header>
  );
}
