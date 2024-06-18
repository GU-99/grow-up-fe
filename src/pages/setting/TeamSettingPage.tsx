import { useState } from 'react';

const user = {
  id: 1,
  name: 'momoco',
  password: '1234',
  email: 'momoco@com',
  phone: '010-1234-7777',
  img: '',
  comment: "Hi, I'm Momoco!",
  link1: 'momoco@github.com',
  link2: null,
  link3: null,
  team: [
    { id: 1, name: 'GU-99', status: 'Y' },
    { id: 2, name: '김찌와 쏘주', status: 'Y' },
    { id: 3, name: '모코코', status: 'N' },
  ],
};

function TeamSettingPage() {
  const [mode, setMode] = useState('Y');
  return (
    <>
      <nav>가입현황</nav>
      <nav>대기현황</nav>
      <div>{user.team[0].name}</div>
    </>
  );
}

export default TeamSettingPage;
