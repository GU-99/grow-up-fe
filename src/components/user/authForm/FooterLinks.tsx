import { useNavigate } from 'react-router-dom';

type FooterLinksProps = {
  type: 'signIn' | 'searchId' | 'searchPassword';
};

export default function FooterLinks({ type }: FooterLinksProps) {
  const nav = useNavigate();

  const renderLinks = () => {
    switch (type) {
      case 'signIn':
        return (
          <>
            <button type="button" className="cursor-pointer bg-inherit font-bold" onClick={() => nav('/search/id')}>
              아이디 찾기
            </button>
            <p>|</p>
            <button
              type="button"
              className="cursor-pointer bg-inherit font-bold"
              onClick={() => nav('/search/password')}
            >
              비밀번호 찾기
            </button>
          </>
        );
      case 'searchId':
        return (
          <>
            <button type="button" className="cursor-pointer bg-inherit font-bold" onClick={() => nav('/signin')}>
              로그인
            </button>
            <p>|</p>
            <button
              type="button"
              className="cursor-pointer bg-inherit font-bold"
              onClick={() => nav('/search/password')}
            >
              비밀번호 찾기
            </button>
          </>
        );
      case 'searchPassword':
        return (
          <>
            <button type="button" className="cursor-pointer bg-inherit font-bold" onClick={() => nav('/signin')}>
              로그인
            </button>
            <p>|</p>
            <button type="button" className="cursor-pointer bg-inherit font-bold" onClick={() => nav('/search/id')}>
              아이디 찾기
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-row justify-center gap-8">{renderLinks()}</div>

      <div className="mb-35 mt-15 flex flex-row items-center justify-center gap-8">
        <p className="items-center font-bold">회원이 아니신가요?</p>
        <button type="button" className="auth-btn" onClick={() => nav('/signup')}>
          회원가입
        </button>
      </div>
    </>
  );
}
