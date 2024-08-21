import { useState } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { UserSignUpForm } from '../types/UserType';
import useToast from '@/hooks/useToast';
import { EmailVerificationForm } from '@/types/UserType';

// 잘 만들었음. 위에 import 추가 방법만 다듬으면 될듯

// 뭔가 얽혀있는데?
// 인증 번호 관리랑 버튼 가시성 관리를 동시해 하려고해서 얽힌것 같은데?
// 가시성을 위한 내용은 VerificationButton에 같이 있어야할 것 같음
// 인증과 관련된 로직만 정제해서 모아야할 듯

// 이름을 조금 변경해야할 것 같아.
// 인증 번호 발급 요청: requestVerificationCode
// 인증 번호 확인: verifyCode
// 인증 번호 만료: handleTimerTimeout -> timeoutVerificationCode, expireVerificationCode
export default function useEmailVerification() {
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const { toastSuccess, toastError } = useToast();

  // 이메일 인증번호 요청 함수
  const requestVerificationCode = () => {
    if (!isVerificationRequested) {
      setIsVerificationRequested(true);
      toastSuccess('인증번호가 발송되었습니다. 이메일을 확인해 주세요.');
      setIsTimerVisible(true);
    }
  };

  // 인증번호 확인 함수
  const verifyCode = (verificationCode: string, setError: UseFormSetError<UserSignUpForm | EmailVerificationForm>) => {
    if (verificationCode === '1234') return true;

    // 인증번호 불일치
    setError('code', {
      type: 'manual',
      message: '인증번호가 일치하지 않습니다.',
    });
    toastError('인증번호가 유효하지 않습니다. 다시 시도해 주세요.');
    return false;
  };

  // 타이머 만료
  const handleTimerTimeout = () => {
    setIsTimerVisible(false);
    setIsVerificationRequested(false);
    toastError('인증 시간이 만료되었습니다. 다시 시도해 주세요.');
  };

  return {
    isVerificationRequested,
    isTimerVisible,
    requestVerificationCode,
    verifyCode,
    handleTimerTimeout,
  };
}
