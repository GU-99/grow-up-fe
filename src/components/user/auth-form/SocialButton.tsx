import { useState } from 'react';
import GoogleIcon from '@assets/social_google_icon.svg';
import KakaoIcon from '@assets/social_kakao_icon.svg';
import useToast from '@hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { SocialLoginProvider } from '@/types/UserType';

type SocialButtonProps = {
  provider: SocialLoginProvider;
  isSubmitting: boolean;
};

export default function SocialButton({ provider, isSubmitting }: SocialButtonProps) {
  const googleUrl = import.meta.env.VITE_GOOGLE_URL;
  const kakaoUrl = import.meta.env.VITE_KAKAO_URL;

  const isGoogle = provider === 'google';

  const [isLoading, setIsLoading] = useState(false);
  const { toastError } = useToast();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLoading(true);
    const url = isGoogle ? googleUrl : kakaoUrl;
    try {
      window.location.href = url;
    } catch (error) {
      toastError('로그인에 실패했습니다. 다시 시도해 주세요.');
      setTimeout(() => {
        navigate('/signin', { replace: true });
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLoginClick}
      className={`auth-btn ${isGoogle ? 'space-x-10 bg-button' : 'space-x-4 bg-kakao'}`}
      disabled={isSubmitting || isLoading}
    >
      <img
        src={isGoogle ? GoogleIcon : KakaoIcon}
        alt={isGoogle ? 'Google' : 'Kakao'}
        className={isGoogle ? 'size-42' : 'size-15'}
      />
      <span>{isGoogle ? '로그인' : '카카오 로그인'}</span>
    </button>
  );
}
