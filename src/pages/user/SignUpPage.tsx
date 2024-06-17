export default function SignUpPage() {
  return (
    <div className="flex flex-col p-10 bg-[#237700] rounded-2xl h-[90vh] overflow-y-scroll scrollbar-hide border border-[#A9A9A9] shadow-xl shadow-gray-500/50">
      <form className="flex flex-col gap-y-4">
        <div className="flex flex-col items-center gap-y-4">
          <div className="w-[15.63rem] h-[15.63rem]">
            <img
              src="https://blog.kakaocdn.net/dn/tEMUl/btrDc6957nj/NwJoDw0EOapJNDSNRNZK8K/img.jpg"
              alt="img"
              className="w-full h-full object-cover rounded-[50%]"
            />
          </div>
          <div className="flex flex-row gap-x-2">
            <label
              htmlFor="file-upload"
              className="w-[6.25rem] h-[4.38rem] bg-[#E1F4D9] rounded-[10px] sm:text-m font-bold flex items-center justify-center cursor-pointer auth-btn"
            >
              등록
              <input id="file-upload" type="file" name="profile" className="hidden" />
            </label>
            <button type="button" className="w-[6.25rem] auth-btn bg-[#EFEFEF]">
              삭제
            </button>
          </div>
        </div>
        <div className="flex flex-row gap-x-2">
          <input
            placeholder="이메일(아이디)을 입력하세요."
            type="text"
            id="email"
            className="w-[20.63rem] auth-input"
          />
          <button type="button" className="w-[10rem] auth-btn">
            인증번호 발송
          </button>
        </div>
        <div className="flex flex-row gap-x-2">
          <input
            placeholder="인증번호를 입력하세요."
            type="text"
            id="verificationCode"
            className="w-[24.38rem] auth-input"
            required
          />
          <button type="button" className="w-[6.25rem] auth-btn">
            확인
          </button>
        </div>
        <div className="flex flex-row gap-x-2">
          <input
            placeholder="닉네임을 입력하세요."
            type="text"
            id="nickname"
            className="w-[21.88rem] auth-input"
            required
          />
          <button type="button" className="w-[8.75rem] auth-btn">
            중복확인
          </button>
        </div>
        <input placeholder="비밀번호" type="password" id="password" className="auth-input" required />
        <input placeholder="비밀번호 확인" type="password" id="checkPassword" className="auth-input" required />
        <input placeholder="자신을 소개해 주세요." type="text" id="bio" className="h-[9.38rem] auth-input " />
        <div className="flex flex-row gap-x-2">
          <input
            placeholder="링크를 등록해 보세요.(GitHub, Blog 등)"
            type="text"
            id="website"
            className="w-[26.31rem] auth-input"
          />
          <button type="button" className="w-[4.38rem] auth-btn">
            -
          </button>
        </div>
        <div className="flex flex-row gap-x-2">
          <input
            placeholder="링크를 추가해 보세요.(GitHub, Blog 등)"
            type="text"
            id="addWebsite"
            className="w-[26.31rem] auth-input bg-[#C2C2C2]"
            required
          />
          <button type="button" className="w-[4.38rem] auth-btn">
            +
          </button>
        </div>
        <div className="flex flex-col gap-y-4 text-center">
          <button type="submit" className="w-[31.25rem] auth-btn">
            회원가입
          </button>
          <p className="sm:text-m font-bold text-[#E1F4D9] cursor-pointer">로그인 페이지로 돌아가기</p>
        </div>
      </form>
    </div>
  );
}
