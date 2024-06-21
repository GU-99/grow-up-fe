/* eslint-disable react/destructuring-assignment */
import { useState } from 'react';

// mode가 Y일때, admin(생성자)가 본인이면 설정하기, 삭제하기 버튼 노출
// -> 설정하기 클릭 시 팀 설정 팝업 / 삭제하기 버튼 클릭 시 team[index] 삭제
// mode가 Y일때, admin(생성자)가 본인이 아니면 탈퇴하기 버튼 노출하고 클릭 시 status N으로 변경
// mode가 N이면, 가입하기, 거부하기 버튼 노출
// -> 가입하기 클릭 시 status Y로 변경 / 거부하기 클릭 시 user.team에서 삭제 및 team[index].coworker에서 삭제
// props.team(user가 속한 팀), props.teamList(전체 팀 리스트 목록)
function ButtonList(props) {
  if (props.team.status === 'Y') {
    if (props.team.id === props.team.admin) {
      return (
        <div>
          <button type="button">설정하기</button>
          <button type="button" value={props.team.id} onClick={(event) => props.onDelete(event.currentTarget.value)}>
            삭제하기
          </button>
        </div>
      );
    }
    if (props.team.id !== props.team.admin) {
      return (
        <div>
          <button type="button">탈퇴하기</button>
        </div>
      );
    }
  }
  if (props.team.status === 'N') {
    return (
      <div>
        <button
          type="button"
          value="Y"
          onClick={(event) => event.currentTarget.value}
          onChange={(event) => event.currentTarget.value}
        >
          가입하기
        </button>
        <button type="button">거부하기</button>
      </div>
    );
  }
}

// mode가 Y이면, status가 Y인 데이터 노출
// mode가 N이면, status가 N인 데이터 노출
function TeamSettingPage() {
  const [status, setStatus] = useState('Y');
  const [userid, setUserId] = useState(1);
  const [teamId, setTeamId] = useState(1);
  const [user, setUser] = useState({
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
  });
  const [teamList, setTeamList] = useState([
    { id: 1, name: 'GU-99', admin: 1, coworker: [2, 3], desc: '' },
    { id: 2, name: '김찌와 쏘주', admin: 3, coworker: [1], desc: '' },
    { id: 3, name: '모코코', admin: 3, coworker: [1, 2], desc: '' },
  ]);

  const list = [];
  for (let i = 0; i < user.team.length; i += 1) {
    if (user.team[i].status === status) {
      list.push(
        <div key={user.team[i].id} className="flex">
          <div>{user.team[i].name}</div>
          <ButtonList
            team={user.team[i]}
            teamList={teamList}
            onDelete={(id) => {
              setTeamId(id);
            }}
          />
        </div>,
      );
    }
  }

  return (
    <>
      <nav>
        <button type="button" value="Y" onClick={(event) => setStatus(event.currentTarget.value)}>
          가입현황
        </button>
        <button type="button" value="N" onClick={(event) => setStatus(event.currentTarget.value)}>
          대기현황
        </button>
      </nav>
      {list}
    </>
  );
}

export default TeamSettingPage;
