import { Link, NavLink } from 'react-router-dom';
import logo from '@assets/logo.svg';
import { FaUserCircle } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';
import { useUserStore } from '@/stores/useUserStore';

export default function Header() {
  // ToDo: 로그인 기능 구현 후, 로그아웃 로직 연결하기
  const userInfoData = useUserStore((state) => state.userInfo);

  return (
    <header className="flex h-header items-center justify-between bg-main px-15">
      <div>
        <Link to="/" className="hover:brightness-90">
          <img className="size-30 select-none" src={logo} alt="GrowUp Logo" />
        </Link>
      </div>
      <nav className="flex items-center">
        <div className="tracking-tight text-white">{userInfoData.nickname}님의 Grow Up! 응원합니다.</div>
        <NavLink to="/" className="ml-10 hover:brightness-90">
          {({ isActive }) => <FiHome className={`size-20 ${isActive ? 'text-selected' : 'text-white'}`} />}
        </NavLink>
        <NavLink to="/setting/user" className="ml-10 hover:brightness-90">
          {({ isActive }) => <FaUserCircle className={`size-20 ${isActive ? 'text-selected' : 'text-white'}`} />}
        </NavLink>
        <button type="button" className="ml-10 h-20 rounded-md bg-white px-4 tracking-tight hover:brightness-90">
          Logout
        </button>
      </nav>
    </header>
  );
}
