import GoogleIcon from '@assets/social_google_icon.svg';
import KakaoIcon from '@assets/social_kakao_icon.svg';
import { SocialLoginProvider } from '@/types/UserType';

type SocialButtonProps = {
  provider: SocialLoginProvider;
  isSubmitting: boolean;
};

const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}&response_type=code&scope=email+profile`;
const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}`;

export default function SocialButton({ provider, isSubmitting }: SocialButtonProps) {
  const isGoogle = provider === 'GOOGLE';

  const handleLoginClick = () => {
    const url = isGoogle ? googleUrl : kakaoUrl;
    window.location.href = url;
  };

  return (
    <button
      type="button"
      onClick={handleLoginClick}
      className={`auth-btn ${isGoogle ? 'space-x-10 bg-button' : 'space-x-4 bg-kakao'}`}
      disabled={isSubmitting}
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
