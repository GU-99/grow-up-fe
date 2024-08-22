import { useForm } from 'react-hook-form';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import useEmailVerification from '@hooks/useEmailVerification';
import ValidationInput from '@components/common/ValidationInput';
import VerificationButton from '@components/user/auth-form/VerificationButton';
import { EmailVerificationForm } from '@/types/UserType';

function UserAuthenticatePage() {
  const { isVerificationRequested, requestVerificationCode, verifyCode, expireVerificationCode } =
    useEmailVerification();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EmailVerificationForm>({
    mode: 'onChange',
  });

  const onSubmit = async (data: EmailVerificationForm) => {
    const verifyResult = verifyCode(watch('code'), setError);
    if (!verifyResult) return;

    // TODO: 인증 성공 후 전역 상태관리 및 리다이렉트 로직 작성
    console.log(data);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-20">
      <div className="flex w-full max-w-300 flex-col gap-20">
        <p className="text-center text-sm text-emphasis">
          개인정보 변경을 위한 이메일 인증 단계입니다.
          <br />
          인증요청 버튼 클릭 후, 이메일로 발송된 인증번호를 입력해주세요.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 이메일 */}
          <ValidationInput
            label="이메일"
            errors={errors.email?.message}
            register={register('email', USER_AUTH_VALIDATION_RULES.EMAIL)}
          />

          {isVerificationRequested && (
            <ValidationInput
              label="인증번호"
              errors={errors.code?.message}
              register={register('code', USER_AUTH_VALIDATION_RULES.CERTIFICATION)}
            />
          )}

          {/* 인증 요청 및 확인 버튼 */}
          <VerificationButton
            isVerificationRequested={isVerificationRequested}
            isSubmitting={isSubmitting}
            requestCode={handleSubmit(requestVerificationCode)}
            expireVerificationCode={expireVerificationCode}
            buttonLabel="확인"
          />
        </form>
      </div>
    </div>
  );
}

export default UserAuthenticatePage;
