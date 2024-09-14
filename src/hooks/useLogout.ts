import { useNavigate } from 'react-router-dom';
import useToast from '@hooks/useToast';
import useStore from '@stores/useStore';
import { logout } from '@services/authService';

export default function useLogout() {
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();
  const { onLogout, clearUserInfo } = useStore();

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
      clearUserInfo();
      navigate('/signin', { replace: true });
      toastSuccess('로그아웃이 완료되었습니다.');
    } catch (error) {
      toastError('로그아웃에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return { handleLogout };
}
