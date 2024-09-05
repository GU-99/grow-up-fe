import { useForm } from 'react-hook-form';
import Kakao from '@assets/social_kakao_icon.svg';
import Google from '@assets/social_google_icon.svg';
import ValidationInput from '@components/common/ValidationInput';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import FooterLinks from '@components/user/auth-form/FooterLinks';
import AuthFormLayout from '@layouts/AuthFormLayout';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import useToast from '@hooks/useToast';
import { login } from '@services/authService';
import { useEffect } from 'react';
import type { UserSignInForm } from '@/types/UserType';
import { useAuthStore } from '@/stores/useAuthStore';
import useAxios from '@/hooks/useAxios';

export default function SignInPage() {
  const { onLogin } = useAuthStore();
  const { toastError } = useToast();
  const navigate = useNavigate();
  const { error, fetchData, headers, loading } = useAxios(login);

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

  const onSubmit = async (formData: UserSignInForm) => {
    await fetchData(formData);
  };

  useEffect(() => {
    if (headers) {
      const accessToken = headers.authorization;
      if (!accessToken) {
        toastError('로그인에 실패했습니다.');
        return;
      }

      onLogin(accessToken.split(' ')[1]);
      navigate('/', { replace: true });
      return;
    }

    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        toastError('아이디와 비밀번호를 한번 더 확인해 주세요.');
        return;
      }
      toastError(`로그인 도중 오류가 발생했습니다: ${error.message}`);
    }
  }, [headers, error]);

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
