import { useNavigate } from 'react-router-dom';

type FooterLinksProps = {
  type: 'signIn' | 'searchId' | 'searchPassword';
};

const texts = {
  signIn: '로그인',
  findId: '아이디 찾기',
  findPassword: '비밀번호 찾기',
};

const paths = {
  signIn: '/signin',
  findId: '/search/id',
  findPassword: '/search/password',
};

const links = {
  signIn: [
    { text: texts.findId, path: paths.findId },
    { text: texts.findPassword, path: paths.findPassword },
  ],
  searchId: [
    { text: texts.signIn, path: paths.signIn },
    { text: texts.findPassword, path: paths.findPassword },
  ],
  searchPassword: [
    { text: texts.signIn, path: paths.signIn },
    { text: texts.findId, path: paths.findId },
  ],
};

export default function FooterLinks({ type }: FooterLinksProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-row justify-center">
        {links[type].map((link, index) => (
          <div key={link.text} className="flex flex-row">
            <button type="button" className="cursor-pointer bg-inherit font-bold" onClick={() => navigate(link.path)}>
              {link.text}
            </button>
            {index < links[type].length - 1 && <p className="mx-8">|</p>}
          </div>
        ))}
      </div>
      <div className="mt-15 flex flex-row items-center justify-center gap-8">
        <p className="items-center font-bold">회원이 아니신가요?</p>
        <button type="button" className="auth-btn" onClick={() => navigate('/signup')}>
          회원가입
        </button>
      </div>
    </>
  );
}
