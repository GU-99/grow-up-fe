import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useToast from '@/hooks/useToast';
import ValidationInput from '@/components/common/ValidationInput';
import { USER_AUTH_VALIDATION_RULES } from '@/constants/formValidationRules';
import Timer from '@/components/common/Timer';
import { EmailVerificationForm } from '@/types/UserType';

// TODO: 회원가입 폼과 겹치는 로직 컴포넌트로 분리
function UserAuthenticatePage() {
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const { toastSuccess, toastError } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerificationForm>({
    mode: 'onChange',
  });

  // 이메일 인증번호 요청 함수
  const requestCode = () => {
    if (!isVerificationRequested) {
      setIsVerificationRequested(true);
      toastSuccess('인증번호가 발송되었습니다. 이메일을 확인해 주세요.');
      setIsTimerVisible(true);
    }
  };

  // 인증번호 체크 함수
  const verifyCode = (code: string) => {
    if (code === '1234') {
      return true;
    }

    // 인증번호 불일치
    setError('code', {
      type: 'manual',
      message: '인증번호가 일치하지 않습니다.',
    });
    return false;
  };

  // 타이머 만료
  const handleTimerTimeout = () => {
    setIsTimerVisible(false);
    setIsVerificationRequested(false);
    toastError('인증 시간이 만료되었습니다. 다시 시도해 주세요.');
  };

  const onSubmit = async (data: EmailVerificationForm) => {
    console.log(data);

    const verifyResult = verifyCode(watch('code'));
    if (!verifyResult) return toastError('인증번호가 유효하지 않습니다. 다시 시도해 주세요.');

    // TODO: 인증 성공 후 전역 상태관리 및 리다이렉트 로직 작성
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex w-full max-w-300 flex-col gap-20">
        <p className="text-center text-sm text-emphasis">
          개인정보 변경을 위한 이메일 인증 단계입니다.
          <br />
          인증요청 버튼 클릭 후, 이메일로 발송된 인증번호를 입력해주세요.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
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
          <div className="flex flex-col gap-8 text-center">
            {!isVerificationRequested ? (
              <button
                type="submit"
                className="flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
                onClick={handleSubmit(requestCode)}
              >
                <span>인증요청</span>
              </button>
            ) : (
              <button
                type="submit"
                className="relative flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
                disabled={isSubmitting}
              >
                {isTimerVisible && (
                  <div className="absolute left-10">
                    <Timer time={180} onTimeout={handleTimerTimeout} />
                  </div>
                )}
                <span>확인</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserAuthenticatePage;
