import useStore from '@stores/useStore';
import { useEffect, type PropsWithChildren } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import useToast from '@/hooks/useToast';
import { getAccessToken } from '@/services/authService';

export default function AfterLoginRoute({ children }: PropsWithChildren) {
  const { toastError } = useToast();
  const navigate = useNavigate();
  const { onLogout, onLogin, clearUserInfo, accessToken, isAuthenticated } = useStore();

  useEffect(() => {
    const autoRefreshToken = async () => {
      try {
        const refreshResponse = await getAccessToken();
        const newAccessToken = refreshResponse.headers.authorization;

        if (!newAccessToken) throw new Error('토큰 발급에 실패했습니다.');

        onLogin(newAccessToken.split(' ')[1]);
      } catch (error) {
        // 토큰 갱신 실패 시 처리
        toastError('로그인 정보가 만료되었습니다. 다시 로그인 해주세요.');
        setTimeout(() => {
          onLogout();
          clearUserInfo();
          navigate('/signin', { replace: true });
        }, 2000);
      }
    };

    if (isAuthenticated && !accessToken) autoRefreshToken();
  }, [accessToken]);

  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  return children || <Outlet />;
}
