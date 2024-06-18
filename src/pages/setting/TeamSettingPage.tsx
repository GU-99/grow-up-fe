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

function TeamList(props) {
  for (let i = 0; i < user.team.length; ) {
    if (user.team[i].status === props) {
      return <div>{user.team[i].name}</div>;
    }
  }
}
// mode가 Y이면 가입현황 nav 선택되고, status가 Y인 데이터 노출
// mode가 N이면 대기현황 nav 선택되고, status가 N인 데이터 노출
function TeamSettingPage() {
  const [mode, setMode] = useState('Y');
  const list = TeamList(mode);
  return (
    <>
      <nav>
        <button type="button" onChange={() => setMode('Y')}>
          가입현황
        </button>
        <button type="button" onChange={() => setMode('N')}>
          대기현황
        </button>
      </nav>
      {list}
    </>
  );
}

export default TeamSettingPage;
