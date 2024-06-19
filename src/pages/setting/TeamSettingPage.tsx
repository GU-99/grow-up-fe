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

// mode가 Y이면, 탈퇴하기 버튼 노출하고 클릭 시 status N으로 변경
// mode가 N이면, 가입하기, 거부하기 버튼 노출
// 가입하기 클릭 시 status Y로 변경 / 거부하기 클릭 시 user.team에서 삭제
function ButtonList(props) {
  if (props === 'Y') {
    return (
      <div>
        <button type="button">탈퇴하기</button>
      </div>
    );
  }
  if (props === 'N') {
    return (
      <div>
        <button type="button">가입하기</button>
        <button type="button">거부하기</button>
      </div>
    );
  }
}

function TeamList(props) {
  const list = [];
  for (let i = 0; i < user.team.length; i) {
    if (user.team[i].status === props.status) {
      list.push(<div>{user.team[i].name}</div>);
    }
  }
  return list;
}

// mode가 Y이면, status가 Y인 데이터 노출
// mode가 N이면, status가 N인 데이터 노출
function TeamSettingPage() {
  const [mode, setMode] = useState('Y');
  return (
    <>
      <nav>
        <button type="button" value="Y" onClick={(event) => setMode(event.currentTarget.value)}>
          가입현황
        </button>
        <button type="button" value="N" onClick={(event) => setMode(event.currentTarget.value)}>
          대기현황
        </button>
      </nav>
      <TeamList status={mode} />
      <ButtonList status={mode} />
    </>
  );
}

export default TeamSettingPage;
