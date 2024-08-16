import { useForm } from 'react-hook-form';
import ValidationInput from '@/components/common/ValidationInput';
import { USER_AUTH_VALIDATION_RULES } from '@/constants/formValidationRules';
import { EmailVerificationForm } from '@/types/UserType';
import AuthForm from '@/components/user/authForm/AuthForm';
import FooterLinks from '@/components/user/authForm/FooterLinks';

export default function SearchIdPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerificationForm>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const onSubmit = (data: EmailVerificationForm) => {
    console.log(data);
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)} marginTop="mt-40">
      {/* 이메일 */}
      <ValidationInput
        isButtonInput
        buttonLabel="인증번호 발송"
        placeholder="이메일"
        errors={errors.email?.message}
        register={register('email', USER_AUTH_VALIDATION_RULES.EMAIL)}
      />

      {/* 이메일 인증 */}
      <ValidationInput
        placeholder="인증번호"
        errors={errors.code?.message}
        register={register('code', USER_AUTH_VALIDATION_RULES.CERTIFICATION)}
      />

      <div className="flex flex-col text-center">
        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          아이디 찾기
        </button>
      </div>

      <FooterLinks type="searchId" />
    </AuthForm>
  );
}
