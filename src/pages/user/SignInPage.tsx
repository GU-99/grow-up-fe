import { useForm } from 'react-hook-form';
import Kakao from '@assets/social_kakao_icon.svg';
import Google from '@assets/social_google_icon.svg';
import ValidationInput from '@components/common/ValidationInput';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import FooterLinks from '@components/user/auth-form/FooterLinks';
import AuthFormLayout from '@layouts/AuthFormLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import type { UserSignInForm } from '@/types/UserType';
import { authAxios } from '@/services/axiosProvider';
import useToast from '@/hooks/useToast';
import { useAuthStore } from '@/stores/useAuthStore';
import { login } from '@/services/authService';

export default function SignInPage() {
  const { Login } = useAuthStore();
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

  // TODO: react-query 코드 분리하기
  const signIn = useMutation({
    mutationFn: (data: UserSignInForm) => login(data),
    onSuccess: (response) => {
      const accessToken = response.headers.authorization;
      if (!accessToken) return toastError('로그인에 실패했습니다.');

      authAxios.defaults.headers.Authorization = accessToken;
      Login(accessToken.replace('Bearer ', ''));

      navigate('/', { replace: true });
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return toastError('아이디와 비밀번호를 한번 더 확인해 주세요.');
      }
      toastError(`로그인 도중 오류가 발생했습니다: ${error}`);
    },
  });

  const onSubmit = async (data: UserSignInForm) => {
    signIn.mutate(data);
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
