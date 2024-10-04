import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '@components/common/Spinner';
import AuthFormLayout from '@layouts/AuthFormLayout';
import useStore from '@stores/useStore';

const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

export default function KakaoCallBack() {
  const [loading, setLoading] = useState(false);
  const { onLogin } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const AUTHORIZE_CODE = new URL(window.location.href).searchParams.get('code');

    const getToken = async () => {
      setLoading(true);

      try {
        const response = await axios.post(
          `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${AUTHORIZE_CODE}`,
          null,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          },
        );

        const accessToken = response.data.access_token;
        if (!accessToken) console.error('토큰 조회 중 오류가 발생했습니다.');

        onLogin(accessToken);
        navigate('/', { replace: true });
      } catch (error) {
        console.error('로그인 도중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (AUTHORIZE_CODE) {
      getToken();
    } else {
      setLoading(false);
      console.error('Authorization code가 없습니다.');
    }
  }, []);

  return (
    <AuthFormLayout>
      <div>{loading && <Spinner />}</div>
    </AuthFormLayout>
  );
}
