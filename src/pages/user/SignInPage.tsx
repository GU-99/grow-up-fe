import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Kakao from '@assets/social_kakao_icon.svg';
import Google from '@assets/social_google_icon.svg';
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/constants/regex';
import { UserSignIn } from '@/types/UserType';

export default function SignInPage() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: UserSignIn) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col overflow-y-scroll rounded-2xl border border-[#A9A9A9] bg-main p-30 shadow-xl shadow-gray-500/50 scrollbar-hide">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex w-300 flex-col gap-8 text-emphasis">
        <div className="mb-24 mt-30 text-large text-white">
          Welcome to our site!
          <br /> Grow Up your Life with us.
        </div>
        <div className="flex flex-row gap-8">
          <input
            {...register('email', {
              required: '이메일(아이디)을 입력해 주세요.',
              pattern: {
                value: EMAIL_REGEX,
                message: '이메일 형식에 맞지 않습니다.',
              },
            })}
            type="email"
            placeholder="이메일 (아이디)"
            className={`auth-input ${errors.email && `border-2 border-[#FF0000]`}`}
          />
        </div>
        {errors.email && <p className="text-sm text-[#FF0000]">{errors.email.message}</p>}

        <input
          {...register('password', {
            required: '비밀번호를 입력해 주세요.',
            minLength: {
              value: 8,
              message: '비밀번호는 최소 8자 이상이어야 합니다.',
            },
            maxLength: {
              value: 16,
              message: '비밀번호는 최대 16자 이하여야 합니다.',
            },
            pattern: {
              value: PASSWORD_REGEX,
              message: '비밀번호는 영문자, 숫자, 기호를 포함해야 합니다.',
            },
          })}
          placeholder="비밀번호 (영문자, 숫자, 기호 포함 8~16자리)"
          type="password"
          id="password"
          className={`auth-input ${errors.password && `border-2 border-[#FF0000]`}`}
        />
        {errors.password && <p className="text-sm text-[#FF0000]">{errors.password.message}</p>}

        <div className="flex flex-col gap-4 text-center">
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            로그인
          </button>
        </div>

        <div className="flex flex-row justify-center gap-8 text-sub">
          <p className="cursor-pointer font-bold" onClick={() => nav('/search/id')} onKeyDown={() => nav('/search/id')}>
            아이디 찾기
          </p>
          <p className="text-white">|</p>
          <p
            className="cursor-pointer font-bold"
            onClick={() => nav('/search/password')}
            onKeyDown={() => nav('/search/password')}
          >
            비밀번호 찾기
          </p>
        </div>

        <div className="mb-35 mt-15 flex flex-row items-center justify-center gap-8">
          <p className="items-center font-bold text-white">회원이 아니신가요?</p>
          <button type="button" className="auth-btn" onClick={() => nav('/signup')}>
            회원가입
          </button>
        </div>

        <div className="flex flex-col gap-4 text-center">
          <button type="button" className="auth-btn bg-[#f6e04b]" disabled={isSubmitting}>
            <img src={Kakao} alt="Kakao" className="mr-5 size-15" />
            카카오 로그인
          </button>
          <button type="button" className="auth-btn bg-button" disabled={isSubmitting}>
            <img src={Google} alt="Google" className="mr-5 size-40" />
            구글 로그인
          </button>
        </div>
      </form>
    </div>
  );
}
