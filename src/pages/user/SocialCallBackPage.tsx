import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const AUTHORIZE_CODE = new URL(window.location.href).searchParams.get('code');
    if (!AUTHORIZE_CODE) {
      toastError('로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setTimeout(() => {
        navigate('/signin', { replace: true });
      }, 2000);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        setUserInfo(response.data);
      } catch (error) {
        throw new Error();
      }
    };

    const processSocialLogin = async () => {
      try {
        const response = await socialLogin(provider, AUTHORIZE_CODE);
        if (!response || !response.headers) throw new Error();

        const accessToken = response.headers.authorization;
        if (!accessToken) throw new Error();

        onLogin(accessToken.split(' ')[1]);
        navigate('/', { replace: true });
      } catch (error) {
        throw new Error();
      }
    };

    const handleSocialLogin = async () => {
      setLoading(true);

      try {
        await processSocialLogin();
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
    handleSocialLogin();
  }, []);

  return (
    <AuthFormLayout>
      <div>{loading && <Spinner />}</div>
    </AuthFormLayout>
  );
}
