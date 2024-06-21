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
    { id: 1, name: 'GU-99' },
    { id: 2, name: '김찌와 쏘주' },
  ],
};

function UserSettingPage() {
  return (
    <>
      <img src={user.img} alt="userProfileImg" />
      <div>
        <input type="text" value={user.name} />
        <button type="submit">닉네임 변경</button>
      </div>
      <div>
        <input type="text" value={user.phone} />
        <button type="submit">번호 변경</button>
      </div>
      <div>
        <textarea name="introduce" value={user.comment} />
        <button type="submit">소개 변경</button>
      </div>
      <div>
        <input type="text" value={user.link1} />
        <button type="submit">Link 변경</button>
      </div>
      <div>
        <input type="text" value={user.email} />
        <button type="submit">인증번호 발송</button>
      </div>
      <div>
        <input type="text" placeholder="인증번호를 입력해주세요." />
        <button type="submit" onChange={(event) => event.target}>
          확인
        </button>
      </div>
      <div>
        <input type="text" placeholder="개인정보 변경을 위한 비밀번호를 입력하세요." />
        <button type="button" onChange={(event) => event.target}>
          변경
        </button>
      </div>
    </>
  );
}

export default UserSettingPage;
