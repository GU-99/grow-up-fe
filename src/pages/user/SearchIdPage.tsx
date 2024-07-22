import { useForm } from 'react-hook-form';
import ValidationInput from '@/components/common/ValidationInput';
import { STATUS_VALIDATION_RULES } from '@/constants/formValidationRules';
import { SearchIDForm } from '@/types/UserType';
import AuthForm from '@/components/user/authForm/AuthForm';
import FooterLinks from '@/components/user/authForm/FooterLinks';

export default function SearchIdPage() {
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
    <AuthForm onSubmit={handleSubmit(onSubmit)} styles="mt-40">
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

      <div className="flex flex-col text-center">
        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          아이디 찾기
        </button>
      </div>

      <FooterLinks type="searchId" />
    </AuthForm>
  );
}
