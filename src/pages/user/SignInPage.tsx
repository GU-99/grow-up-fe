import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import Meta from '@components/common/Meta';
import ValidationInput from '@components/common/ValidationInput';
import FooterLinks from '@components/user/auth-form/FooterLinks';
import SocialButton from '@components/user/auth-form/SocialButton';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import useToast from '@hooks/useToast';
import AuthFormLayout from '@layouts/AuthFormLayout';
import { getUserInfo, login } from '@services/authService';
import { useStore } from '@stores/useStore';
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
      console.log(response.data);
    } catch (error) {
      console.error('유저정보 오류', error);
      throw new Error('유저 정보를 가져오는 데 실패했습니다.');
    }
  };

  const handleLogin = async (formData: UserSignInForm) => {
    try {
      const response = await login(formData);
      if (!response.headers) throw new Error();
      console.log('response', response);

      const accessToken = response.headers.authorization;
      if (!accessToken) throw new Error();
      console.log('accessToken', accessToken);

      onLogin(accessToken.split(' ')[1]);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error('아이디와 비밀번호를 한번 더 확인해 주세요.');
      }
      console.error('로그인 도중 오류', axiosError);
      throw new Error('로그인 도중 오류가 발생했습니다.');
    }
  };

  const onSubmit = async (formData: UserSignInForm) => {
    try {
      await handleLogin(formData);
      console.log('로그인 완료');
      await fetchUserInfo();
      console.log('유저정보 가져옴');
      navigate('/', { replace: true });
    } catch (error) {
      const axiosError = error as Error;
      console.error('로그인 + 유저정보 오류', axiosError);
      toastError(axiosError.message);
    }
  };

  return (
    <>
      <Meta title="Grow Up : 로그인" />
      <AuthFormLayout onSubmit={handleSubmit(onSubmit)}>
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
      <section className="bottom-0 flex flex-col gap-8 text-center">
        <SocialButton isSubmitting={isSubmitting} provider="kakao" />
        <SocialButton isSubmitting={isSubmitting} provider="google" />
      </section>
    </>
  );
}
