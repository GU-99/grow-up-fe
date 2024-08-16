import { Outlet, useLocation } from 'react-router-dom';
import ListSidebar from '@components/sidebar/ListSidebar';
import { USER_INFO_DUMMY } from '@mocks/mockData';
import ListSetting from '@/components/sidebar/ListSetting';

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
    label: 'My Teams',
    route: 'teams',
  },
];

export default function SettingLayout() {
  const location = useLocation();

  const getTitle = () => {
    const currentPath = location.pathname.split('/').slice(-1)[0];
    const currentNavItem = navList.find((item) => item.route === currentPath);

    return currentNavItem ? currentNavItem.label : '이메일 인증';
  };

  return (
    <section className="flex h-full p-15">
      <ListSidebar title={`${USER_INFO_DUMMY.nickname} 님의 정보`}>
        <ListSetting navList={navList} />
      </ListSidebar>
      <section className="flex w-2/3 flex-col border border-list bg-contents-box">
        <header className="flex h-30 items-center justify-between border-b p-10">
          <div>
            <small className="font-bold text-category">{getTitle()}</small>
          </div>
        </header>
        <div className="h-screen overflow-auto">
          <Outlet />
        </div>
      </section>
    </section>
  );
}
