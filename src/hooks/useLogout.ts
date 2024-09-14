import { useNavigate } from 'react-router-dom';
import useToast from '@hooks/useToast';
import useStore from '@stores/useStore';
import { logout } from '@services/authService';

export default function useLogout() {
  const navigate = useNavigate();
  const { toastSuccess } = useToast();
  const { onLogout, clearUserInfo } = useStore();

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
      clearUserInfo();
      navigate('/signin', { replace: true });
      setTimeout(() => {
        toastSuccess('로그아웃이 완료되었습니다.');
      }, 100);
    } catch (error) {
      console.error('로그아웃 도중 에러가 발생했습니다.');
    }
  };

  return { handleLogout };
}
