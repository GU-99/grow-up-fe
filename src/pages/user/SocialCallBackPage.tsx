import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '@components/common/Spinner';
import AuthFormLayout from '@layouts/AuthFormLayout';
import useStore from '@stores/useStore';
import { getUserInfo, googleLogin, kakaoLogin } from '@services/authService';
import useToast from '@hooks/useToast';

type SocialCallBackProps = {
  provider: 'KAKAO' | 'GOOGLE';
};

export default function SocialCallBackPage({ provider }: SocialCallBackProps) {
  const [loading, setLoading] = useState(false);
  const { toastError } = useToast();
  const { onLogin, setUserInfo } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const AUTHORIZE_CODE = new URL(window.location.href).searchParams.get('code');
    if (!AUTHORIZE_CODE) return;

    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        setUserInfo(response.data);
      } catch (error) {
        throw new Error('유저 정보를 가져오는 데 실패했습니다.');
      }
    };

    const processSocialLogin = async () => {
      let response;
      try {
        if (provider === 'KAKAO') response = await kakaoLogin(AUTHORIZE_CODE);
        if (provider === 'GOOGLE') response = await googleLogin(AUTHORIZE_CODE);

        if (!response) throw new Error();

        const accessToken = response.headers.authorization;
        if (!accessToken) throw new Error();

        onLogin(accessToken.split(' ')[1]);
        navigate('/', { replace: true });
      } catch (error) {
        toastError('로그인 도중 오류가 발생했습니다.');
        navigate('/signin', { replace: true });
      }
    };

    const handleSocialLogin = async () => {
      setLoading(true);

      try {
        await processSocialLogin();
        await fetchUserInfo();
        navigate('/', { replace: true });
      } catch (error) {
        const axiosError = error as Error;
        toastError(axiosError.message);
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
