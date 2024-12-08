import { useNavigate } from 'react-router-dom';

type SearchResultSectionProps = {
  label: '아이디' | '임시 비밀번호';
  result: string;
};

export default function SearchResultSection({ label, result }: SearchResultSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="space-y-20 text-center">
      <div className="space-y-5">
        <p>{label}</p>
        <p>
          <strong>{result}</strong>
        </p>
      </div>
      <button type="button" className="auth-btn w-full" onClick={() => navigate('/signin')}>
        로그인으로 돌아가기
      </button>
    </section>
  );
}
