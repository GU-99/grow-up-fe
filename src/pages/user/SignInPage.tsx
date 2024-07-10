import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Kakao from '@assets/social_kakao_icon.svg';
import Google from '@assets/social_google_icon.svg';
import { UserSignIn } from '@/types/UserType';
import ValidationInput from '@/components/common/ValidationInput';
import { STATUS_VALIDATION_RULES } from '@/constants/formValidationRules';

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex h-screen w-300 flex-col py-30">
      <section className="h-1/6 text-large text-main">
        Welcome to our site!
        <br /> Grow Up your Life with us.
      </section>

      <section className="flex flex-grow flex-col justify-center gap-8">
        {/* 이메일(아이디) */}
        <ValidationInput
          placeholder="이메일"
          errors={errors.email?.message}
          register={register('email', STATUS_VALIDATION_RULES.EMAIL())}
        />

        {/* 비밀번호 */}
        <ValidationInput
          placeholder="비밀번호 (영문자, 숫자, 기호 포함 8~16자리)"
          type="password"
          errors={errors.password?.message}
          register={register('password', STATUS_VALIDATION_RULES.PASSWORD())}
        />

        <div className="flex flex-col gap-4 text-center">
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            로그인
          </button>
        </div>

        <div className="flex flex-row justify-center gap-8">
          <button type="button" className="cursor-pointer bg-inherit font-bold" onClick={() => nav('/search/id')}>
            아이디 찾기
          </button>
          <p>|</p>
          <button type="button" className="cursor-pointer bg-inherit font-bold" onClick={() => nav('/search/password')}>
            비밀번호 찾기
          </button>
        </div>

        <div className="mb-35 mt-15 flex flex-row items-center justify-center gap-8">
          <p className="items-center font-bold">회원이 아니신가요?</p>
          <button type="button" className="auth-btn" onClick={() => nav('/signup')}>
            회원가입
          </button>
        </div>
      </section>

      <section className="flex h-1/6 flex-col gap-4 text-center">
        <button type="button" className="auth-btn bg-kakao" disabled={isSubmitting}>
          <div className="flex w-81 items-center justify-between">
            <img src={Kakao} alt="Kakao" className="size-15" />
            카카오 로그인
          </div>
        </button>
        <button type="button" className="auth-btn bg-button" disabled={isSubmitting}>
          <div className="flex w-81 items-center justify-between">
            <img src={Google} alt="Google" className="size-42" />
            로그인
          </div>
        </button>
      </section>
    </form>
  );
}
