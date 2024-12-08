import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '@components/common/Spinner';
import AuthFormLayout from '@layouts/AuthFormLayout';
import useStore from '@stores/useStore';
import { getUserInfo, socialLogin } from '@services/authService';
import useToast from '@hooks/useToast';
import { SocialLoginProvider } from '@/types/UserType';

type SocialCallBackProps = {
  provider: SocialLoginProvider;
};

export default function SocialCallBackPage({ provider }: SocialCallBackProps) {
  const [loading, setLoading] = useState(false);
  const { toastError } = useToast();
  const { onLogin, setUserInfo } = useStore();
  const navigate = useNavigate();
  const hasEffectRun = useRef(false);

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo();
      setUserInfo(response.data);
    } catch (error) {
      throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
    }
  };

  const processSocialLogin = async (code: string) => {
    try {
      const response = await socialLogin(provider, code);
      if (!response || !response.headers) throw new Error();

      const accessToken = response.headers.authorization;
      if (!accessToken) throw new Error();

      onLogin(accessToken.split(' ')[1]);
    } catch (error) {
      throw new Error('소셜 로그인에 실패했습니다.');
    }
  };

  const handleSocialLogin = async (code: string) => {
    if (loading) return;
    setLoading(true);

    try {
      await processSocialLogin(code);
      await fetchUserInfo();
      navigate('/', { replace: true });
    } catch (error) {
      toastError('로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setTimeout(() => {
        navigate('/signin', { replace: true });
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasEffectRun.current) return;
    hasEffectRun.current = true;

    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) {
      toastError('로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setTimeout(() => {
        navigate('/signin', { replace: true });
      }, 2000);
      return;
    }

    handleSocialLogin(code);
  }, []);

  return (
    <AuthFormLayout>
      <div>{loading && <Spinner />}</div>
    </AuthFormLayout>
  );
}
