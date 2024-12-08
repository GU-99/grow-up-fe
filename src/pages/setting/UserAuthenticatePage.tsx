import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import useEmailVerification from '@hooks/useEmailVerification';
import Meta from '@components/common/Meta';
import ValidationInput from '@components/common/ValidationInput';
import VerificationButton from '@components/user/auth-form/VerificationButton';
import useToast from '@hooks/useToast';
import { checkEmailCode } from '@services/authService';
import { useStore } from '@stores/useStore';
import { EmailVerificationForm } from '@/types/UserType';

function UserAuthenticatePage() {
  const navigate = useNavigate();
  const { onVerifyCode } = useStore();
  const { isVerificationRequested, requestVerificationCode, expireVerificationCode } = useEmailVerification();
  const { toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EmailVerificationForm>({
    mode: 'onChange',
  });

  const onSubmit = async (data: EmailVerificationForm) => {
    // ToDo: useAxios 훅을 이용한 네트워크 로직으로 변경
    try {
      await checkEmailCode(data);
      onVerifyCode();
      navigate('/setting/password', { replace: true });
    } catch (error) {
      if (error instanceof AxiosError && error.response) toastError(error.response.data.message);
      else toastError('예상치 못한 에러가 발생했습니다.');
    }
  };

  return (
    <>
      <Meta title="Grow Up : 이메일 인증" />
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
                errors={errors.verificationCode?.message}
                register={register('verificationCode', USER_AUTH_VALIDATION_RULES.VERIFICATION_CODE)}
              />
            )}

            {/* 인증 요청 및 확인 버튼 */}
            <VerificationButton
              isVerificationRequested={isVerificationRequested}
              isSubmitting={isSubmitting}
              requestCode={handleSubmit(() => requestVerificationCode(watch('email')))}
              expireVerificationCode={expireVerificationCode}
              buttonLabel="확인"
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default UserAuthenticatePage;
