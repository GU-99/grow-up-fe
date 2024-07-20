import { useForm } from 'react-hook-form';
import ValidationInput from '@/components/common/ValidationInput';
import { STATUS_VALIDATION_RULES } from '@/constants/formValidationRules';
import AuthForm from '@/components/user/authForm/AuthForm';
import FooterLinks from '@/components/user/authForm/FooterLinks';
import { SearchPasswordForm } from '@/types/UserType';

export default function SearchPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchPasswordForm>({
    mode: 'onChange',
    defaultValues: {
      id: '',
      email: '',
      code: '',
    },
  });

  const onSubmit = (data: SearchPasswordForm) => {
    console.log(data);
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      <section className="auth-form-section">
        {/* 아이디 */}
        <ValidationInput
          placeholder="아이디"
          errors={errors.id?.message}
          register={register('id', STATUS_VALIDATION_RULES.ID())}
        />

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

        <div className="centered-flex-col">
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            비밀번호 찾기
          </button>
        </div>

        <FooterLinks type="searchPassword" />
      </section>
    </AuthForm>
  );
}
