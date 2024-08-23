import { useForm } from 'react-hook-form';
import Kakao from '@assets/social_kakao_icon.svg';
import Google from '@assets/social_google_icon.svg';
import ValidationInput from '@components/common/ValidationInput';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import FooterLinks from '@components/user/auth-form/FooterLinks';
import AuthFormLayout from '@layouts/AuthFormLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { UserSignInForm } from '@/types/UserType';
import { authAxios, defaultAxios } from '@/services/axiosProvider';
import useToast from '@/hooks/useToast';
import { setCookie } from '@/utils/cookies';
import { useAuthStore } from '@/stores/useAuthStore';

export default function SignInPage() {
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

  const onSubmit = async (data: UserSignInForm) => {
    console.log(data);
    try {
      const response = await defaultAxios.post('user/login', data, { withCredentials: true });

      if (response.status === 200) {
        const { accessToken } = response.data;

        authAxios.defaults.headers.Authorization = `Bearer ${accessToken}`;
        setCookie('accessToken', accessToken, { path: '/' });
        console.log(document.cookie);
        useAuthStore.getState().Login();

        navigate('/', { replace: true });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return toastError('아이디와 비밀번호를 한번 더 확인해 주세요.');
      }
      console.error('로그인 도중 오류가 발생했습니다.', error);
      toastError('로그인 도중 오류가 발생했습니다.');
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
