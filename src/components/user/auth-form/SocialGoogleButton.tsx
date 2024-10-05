import Google from '@assets/social_google_icon.svg';

type SocialGoogleButtonProps = {
  isSubmitting: boolean;
};

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email+profile`;

export default function SocialGoogleButton({ isSubmitting }: SocialGoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = googleUrl;
      }}
      className="auth-btn space-x-10 bg-button"
      disabled={isSubmitting}
    >
      <img src={Google} alt="Google" className="size-42" />
      <span>로그인</span>
    </button>
  );
}
