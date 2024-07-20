import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ValidationInput from '@/components/common/ValidationInput';
import { STATUS_VALIDATION_RULES } from '@/constants/formValidationRules';

type SearchIDForm = {
  email: string;
  code: string;
};

export default function SearchIdPage() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchIDForm>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const onSubmit = (data: SearchIDForm) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex h-screen w-300 flex-col py-30">
      <section className="h-1/6 text-large text-main">
        Welcome to our site!
        <br /> Grow Up your Life with us.
      </section>

      <section className="flex flex-grow flex-col justify-center gap-8">
        {/* 이메일 */}
        <ValidationInput
          isButtonInput
          buttonLabel="인증번호 발송"
          placeholder="이메일"
          errors={errors.email?.message}
          register={register('email', STATUS_VALIDATION_RULES.EMAIL())}
        />

        {/* 이메일 인증 */}
        <ValidationInput
          placeholder="인증번호"
          errors={errors.code?.message}
          register={register('code', STATUS_VALIDATION_RULES.CERTIFICATION())}
        />

        <div className="flex flex-col gap-4 text-center">
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            아이디 찾기
          </button>
        </div>

        <div className="flex flex-row justify-center gap-8">
          <button type="button" className="cursor-pointer bg-inherit font-bold" onClick={() => nav('/search/id')}>
            로그인
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
    </form>
  );
}
