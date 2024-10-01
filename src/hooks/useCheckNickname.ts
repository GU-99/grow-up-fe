import { AxiosError } from 'axios';
import { useState } from 'react';
import useToast from '@hooks/useToast';
import useEmailVerification from '@hooks/useEmailVerification';
import { checkNicknameDuplicate } from '@services/authService';

export default function useCheckNickname(
  nickname: string,
  isNicknameDirty: boolean | undefined,
  email: string,
  hasNicknameError: boolean,
) {
  const { toastError, toastSuccess, toastWarn } = useToast();
  const { requestVerificationCode } = useEmailVerification();
  const [checkedNickname, setCheckedNickname] = useState(false);

  // 중복 확인 후 닉네임 변경 시, 중복확인 버튼 재활성화
  if (isNicknameDirty) setCheckedNickname(false);

  const checkNickname = async () => {
    if (!nickname || hasNicknameError) return;

    try {
      await checkNicknameDuplicate({ nickname });
      toastSuccess('사용 가능한 닉네임입니다.');
      setCheckedNickname(true);
    } catch (error) {
      if (error instanceof AxiosError && error.response) toastError(error.response.data.message);
      else toastError('예상치 못한 에러가 발생했습니다.');
    }
  };

  const handleRequestVerificationCode = () => {
    if (!checkedNickname) return toastWarn('닉네임 중복 체크를 진행해 주세요.');
    requestVerificationCode(email);
  };

  return { checkedNickname, checkNickname, handleRequestVerificationCode };
}
