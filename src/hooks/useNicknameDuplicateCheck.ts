import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { checkNicknameDuplicate } from '@services/authService';
import useToast from '@hooks/useToast';

export default function useNicknameDuplicateCheck(nickname: string, errorMessage?: string) {
  const { toastSuccess, toastError } = useToast();
  const [checkedNickname, setCheckedNickname] = useState(false);
  const [lastCheckedNickname, setLastCheckedNickname] = useState('');

  // 닉네임 중복 확인 함수
  const checkNickname = async () => {
    if (!nickname || errorMessage) return;

    try {
      await checkNicknameDuplicate({ nickname });
      toastSuccess('사용 가능한 닉네임입니다.');
      setCheckedNickname(true);
      setLastCheckedNickname(nickname);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toastError(error.response.data.message);
      } else {
        toastError('예상치 못한 에러가 발생했습니다.');
      }
    }
  };

  // 닉네임 변경 시 중복 확인 버튼 재활성화
  useEffect(() => {
    if (nickname !== lastCheckedNickname) setCheckedNickname(false);
  }, [nickname, lastCheckedNickname]);

  return {
    checkedNickname,
    checkNickname,
  };
}
