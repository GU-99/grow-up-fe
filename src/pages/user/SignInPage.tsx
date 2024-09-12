import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import Kakao from '@assets/social_kakao_icon.svg';
import Google from '@assets/social_google_icon.svg';
import ValidationInput from '@components/common/ValidationInput';
import FooterLinks from '@components/user/auth-form/FooterLinks';
import AuthFormLayout from '@layouts/AuthFormLayout';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import useToast from '@hooks/useToast';
import { getUserInfo, login } from '@services/authService';
import { useStore } from '@/stores/useStore';
import type { UserSignInForm } from '@/types/UserType';

export default function SignInPage() {
  const { onLogin, setUserInfo } = useStore();
  const { toastError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo();
      setUserInfo(response.data);
    } catch (error) {
      throw new Error('유저 정보를 가져오는 데 실패했습니다.');
    }
  };

  const handleLogin = async (formData: UserSignInForm) => {
    try {
      const response = await login(formData);
      if (!response.headers) throw new Error();

      const accessToken = response.headers.authorization;
      if (!accessToken) throw new Error();

      onLogin(accessToken.split(' ')[1]);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error('아이디와 비밀번호를 한번 더 확인해 주세요.');
      }
      throw new Error('로그인 도중 오류가 발생했습니다.');
    }
  };

  const onSubmit = async (formData: UserSignInForm) => {
    try {
      await handleLogin(formData);
      await fetchUserInfo();
      navigate('/', { replace: true });
    } catch (error) {
      const axiosError = error as Error;
      toastError(axiosError.message);
    }
  };

  return (
    <>
      <AuthFormLayout onSubmit={handleSubmit(onSubmit)} marginTop="mt-40">
        {/* 아이디 */}
        <ValidationInput
          placeholder="아이디"
          errors={errors.username?.message}
          register={register('username', USER_AUTH_VALIDATION_RULES.ID)}
        />

        {/* 비밀번호 */}
        <ValidationInput
          placeholder="비밀번호 (영문자, 숫자, 기호 포함 8~16자리)"
          type="password"
          errors={errors.password?.message}
          register={register('password', USER_AUTH_VALIDATION_RULES.PASSWORD)}
        />

        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          로그인
        </button>

        <FooterLinks type="signIn" />
      </AuthFormLayout>
      <section className="flex h-1/6 flex-col gap-8 text-center">
        <button type="button" className="auth-btn space-x-4 bg-kakao" disabled={isSubmitting}>
          <img src={Kakao} alt="Kakao" className="size-15" />
          <span>카카오 로그인</span>
        </button>
        <button type="button" className="auth-btn space-x-10 bg-button" disabled={isSubmitting}>
          <img src={Google} alt="Google" className="size-42" />
          <span>로그인</span>
        </button>
      </section>
    </>
  );
}
