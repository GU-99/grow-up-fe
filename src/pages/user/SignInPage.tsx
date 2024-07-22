import { useForm } from 'react-hook-form';
import Kakao from '@assets/social_kakao_icon.svg';
import Google from '@assets/social_google_icon.svg';
import { UserSignInForm } from '@/types/UserType';
import ValidationInput from '@/components/common/ValidationInput';
import { STATUS_VALIDATION_RULES } from '@/constants/formValidationRules';
import AuthForm from '@/components/user/authForm/AuthForm';
import FooterLinks from '@/components/user/authForm/FooterLinks';

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: '',
      password: '',
    },
  });

  const onSubmit = (data: UserSignInForm) => {
    console.log(data);
  };

  return (
    <>
      <AuthForm onSubmit={handleSubmit(onSubmit)} styles="mt-40">
        {/* 아이디 */}
        <ValidationInput
          placeholder="아이디"
          errors={errors.id?.message}
          register={register('id', STATUS_VALIDATION_RULES.ID)}
        />

        {/* 비밀번호 */}
        <ValidationInput
          placeholder="비밀번호 (영문자, 숫자, 기호 포함 8~16자리)"
          type="password"
          errors={errors.password?.message}
          register={register('password', STATUS_VALIDATION_RULES.PASSWORD)}
        />

        <div className="flex flex-col text-center">
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            로그인
          </button>
        </div>

        <FooterLinks type="signIn" />
      </AuthForm>
      <section className="flex h-1/6 flex-col gap-8 text-center">
        <button type="button" className="auth-btn bg-kakao" disabled={isSubmitting}>
          <div className="flex h-30 w-81 items-center justify-between">
            <img src={Kakao} alt="Kakao" className="size-15" />
            카카오 로그인
          </div>
        </button>
        <button type="button" className="auth-btn bg-button" disabled={isSubmitting}>
          <div className="flex h-30 w-81 items-center justify-between">
            <img src={Google} alt="Google" className="size-42" />
            로그인
          </div>
        </button>
      </section>
    </>
  );
}
