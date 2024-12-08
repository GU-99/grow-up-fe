import { useState } from 'react';
import { AxiosError } from 'axios';
import { sendEmailCode } from '@services/authService';
import useToast from '@hooks/useToast';

export default function useEmailVerification() {
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const { toastSuccess, toastError } = useToast();

  // 이메일 인증번호 요청 함수
  const requestVerificationCode = async (email: string) => {
    if (isVerificationRequested) return;

    try {
      await sendEmailCode({ email });
      setIsVerificationRequested(true);
      toastSuccess('인증번호가 발송되었습니다. 이메일을 확인해 주세요.');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toastError(error.response.data.message);
      } else {
        toastError('예상치 못한 에러가 발생했습니다.');
      }
    }
  };

  // 인증 코드 만료
  const expireVerificationCode = (showMessage = true) => {
    setIsVerificationRequested(false);
    if (showMessage) toastError('인증 시간이 만료되었습니다. 다시 시도해 주세요.');
  };

  return {
    isVerificationRequested,
    requestVerificationCode,
    expireVerificationCode,
  };
}
