import Kakao from '@assets/social_kakao_icon.svg';

type SocialKaKaoButtonProps = {
  isSubmitting: boolean;
};

const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

export default function SocialKaKaoButton({ isSubmitting }: SocialKaKaoButtonProps) {
  const handleLogin = () => {
    window.location.href = kakaoUrl;
  };

  return (
    <button type="button" onClick={handleLogin} className="auth-btn space-x-4 bg-kakao" disabled={isSubmitting}>
      <img src={Kakao} alt="Kakao" className="size-15" />
      <span>카카오 로그인</span>
    </button>
  );
}
