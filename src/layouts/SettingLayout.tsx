import { Outlet } from 'react-router-dom';

const user = {
  id: 1,
  name: 'momoco',
  password: '1234',
  email: 'momoco@com',
  phone: '010-1234-7777',
  comment: "Hi, I'm Momoco!",
  link1: 'momoco@github.com',
  link2: null,
  link3: null,
  team: [
    { id: 1, name: 'GU-99' },
    { id: 2, name: '김찌와 쏘주' },
  ],
};

function SettingLayout() {
  return (
    <>
      <p>{user.name}님의 정보</p>
      <p>
        <a href="/setting/user">개인정보변경</a>
      </p>
      <p>
        <a href="/setting/team">My Teams</a>
      </p>
      <Outlet />
    </>
  );
}

export default SettingLayout;
