/* eslint-disable react/destructuring-assignment */
import { useState } from 'react';

const user = {
  id: 1,
  name: 'mococo',
  password: '1234',
  email: 'mococo@com',
  phone: '010-1234-7777',
  img: '',
  comment: "Hi, I'm Mococo!",
  link1: 'mococo@github.com',
  link2: null,
  link3: null,
  team: [
    { id: 1, name: 'GU-99', status: 'Y', admin: 1 },
    { id: 2, name: '김찌와 쏘주', status: 'Y', admin: 3 },
    { id: 3, name: '모코코', status: 'N', admin: 3 },
  ],
};

// mode가 Y일때, admin(생성자)가 본인이면 설정하기, 삭제하기 버튼 노출
// -> 설정하기 클릭 시 팀 설정 팝업 / 삭제하기 버튼 클릭 시 team[index] 삭제
// mode가 Y일때, admin(생성자)가 본인이 아니면 탈퇴하기 버튼 노출하고 클릭 시 status N으로 변경
// mode가 N이면, 가입하기, 거부하기 버튼 노출
// -> 가입하기 클릭 시 status Y로 변경 / 거부하기 클릭 시 user.team에서 삭제 및 team[index].coworker에서 삭제

function ButtonList(props: { status: string; id: number; admin: number }) {
  const [mode, setMode] = useState(props.status);
  const [teamList, setTeamList] = useState([
    { id: 1, name: 'GU-99', admin: 1, coworker: [2, 3], desc: '' },
    { id: 2, name: '김찌와 쏘주', admin: 3, coworker: [1], desc: '' },
    { id: 3, name: '모코코', admin: 3, coworker: [1, 2], desc: '' },
  ]);

  const [coworker, setCoworker] = useState(teamList[Number(props.id)]);
  const [status, setStatus] = useState(props.status);
  const newTeam = {
    id: props.id,
    name: teamList[Number(props.id)].name,
    admin: props.admin,
    coworker: teamList[Number(props.id)].coworker,
    desc: teamList[Number(props.id)].desc,
  };
  const newTeamList = [...teamList];
  newTeamList.push(newTeam);
  setTeamList(newTeamList);

  if (props.status === 'Y') {
    if (props.id === props.admin) {
      return (
        <div>
          <button type="button">설정하기</button>
          <button type="button">삭제하기</button>
        </div>
      );
    }
    if (props.id !== props.admin) {
      return (
        <div>
          <button type="button">탈퇴하기</button>
        </div>
      );
    }
  }
  if (props.status === 'N') {
    return (
      <div>
        <button
          type="button"
          value="Y"
          onClick={(event) => setMode(event.currentTarget.value)}
          onChange={(event) => setStatus(event.currentTarget.value)}
        >
          가입하기
        </button>
        <button type="button">거부하기</button>
      </div>
    );
  }
}

function TeamList(props: { status: string }) {
  const list = [];
  for (let i = 0; i < user.team.length; i += 1) {
    if (user.team[i].status === props.status) {
      list.push(
        <div className="flex">
          <div>{user.team[i].name}</div>
          <ButtonList status={props.status} id={user.id} admin={user.team[i].admin} />
        </div>,
      );
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
    </>
  );
}

export default TeamSettingPage;
