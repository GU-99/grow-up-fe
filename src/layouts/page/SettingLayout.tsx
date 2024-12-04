import { Outlet, useLocation } from 'react-router-dom';
import ListSidebar from '@components/sidebar/ListSidebar';
import ListSetting from '@components/sidebar/ListSetting';
import useStore from '@stores/useStore';

const navList = [
  {
    label: '개인정보 변경',
    route: 'user',
  },
  {
    label: '비밀번호 변경',
    route: 'password',
  },
  {
    label: '팀 관리',
    route: 'teams',
  },
];

export default function SettingLayout() {
  const location = useLocation();
  const { userInfo } = useStore();

  const getTitle = () => {
    const currentPath = location.pathname.split('/')[2];
    const currentNavItem = navList.find((item) => item.route === currentPath);

    return currentNavItem ? currentNavItem.label : '이메일 인증';
  };

  return (
    <section className="flex h-full gap-10 p-15">
      <ListSidebar title={`${userInfo.nickname} 님의 정보`}>
        <ListSetting navList={navList} />
      </ListSidebar>
      <section className="flex grow flex-col overflow-x-scroll border border-list bg-contents-box">
        <header className="flex h-30 items-center justify-between border-b p-10">
          <div>
            <small className="font-bold text-category">{getTitle()}</small>
          </div>
        </header>
        <div className="grow overflow-auto">
          <Outlet />
        </div>
      </section>
    </section>
  );
}
