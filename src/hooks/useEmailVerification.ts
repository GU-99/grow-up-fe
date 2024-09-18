import { useState } from 'react';
import { UseFormSetError } from 'react-hook-form';
import useToast from '@hooks/useToast';
import type { EmailVerificationForm, UserSignUpForm } from '@/types/UserType';

export default function useEmailVerification() {
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const { toastSuccess, toastError } = useToast();

  // 이메일 인증번호 요청 함수
  const requestVerificationCode = () => {
    if (!isVerificationRequested) {
      setIsVerificationRequested(true);
      toastSuccess('인증번호가 발송되었습니다. 이메일을 확인해 주세요.');
    }
  };

  // 인증번호 확인 함수
  const verifyCode = (verificationCode: string, setError: UseFormSetError<UserSignUpForm | EmailVerificationForm>) => {
    // ToDo: 이메일 인증 API 추가
    if (verificationCode === '1234') return true;

    // 인증번호 불일치
    setError('code', {
      type: 'manual',
      message: '인증번호가 일치하지 않습니다.',
    });
    toastError('인증번호가 유효하지 않습니다. 다시 시도해 주세요.');
    return false;
  };

  // 인증 코드 만료
  const expireVerificationCode = () => {
    setIsVerificationRequested(false);
    toastError('인증 시간이 만료되었습니다. 다시 시도해 주세요.');
  };

  return {
    isVerificationRequested,
    requestVerificationCode,
    verifyCode,
    expireVerificationCode,
  };
}
