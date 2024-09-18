import { useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import ValidationInput from '@components/common/ValidationInput';
import FooterLinks from '@components/user/auth-form/FooterLinks';
import VerificationButton from '@components/user/auth-form/VerificationButton';
import Spinner from '@components/common/Spinner';
import useEmailVerification from '@hooks/useEmailVerification';
import useToast from '@hooks/useToast';
import AuthFormLayout from '@layouts/AuthFormLayout';
import { searchUserId } from '@services/authService';
import { EmailVerificationForm } from '@/types/UserType';

export default function SearchIdPage() {
  const { isVerificationRequested, requestVerificationCode, expireVerificationCode } = useEmailVerification();
  const [searchIdResult, setSearchIdResult] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const { toastError } = useToast();
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerificationForm>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const onSubmit = async (data: EmailVerificationForm) => {
    setLoading(true);
    try {
      const fetchData = await searchUserId(data);
      setSearchIdResult(fetchData.data.username);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toastError(error.response.data.message);
      } else {
        toastError('예상치 못한 에러가 발생했습니다.');
      }
    }
    setLoading(false);
  };

  return (
    <AuthFormLayout onSubmit={handleSubmit(onSubmit)} marginTop="mt-40">
      {loading && <Spinner />}

      {!loading && searchIdResult && (
        <div className="mt-40 h-full space-y-20">
          <div className="text-center">
            회원님의 아이디는
            <br />
            <b>{searchIdResult}</b>
            <br />
            입니다.
          </div>
          <button type="button" className="auth-btn w-full" onClick={() => nav('/signin')}>
            로그인으로 돌아가기
          </button>
        </div>
      )}

      {!loading && !searchIdResult && (
        <>
          {/* 이메일 */}
          <ValidationInput
            label="이메일"
            errors={errors.email?.message}
            register={register('email', USER_AUTH_VALIDATION_RULES.EMAIL)}
          />

          {isVerificationRequested && (
            <ValidationInput
              label="인증번호"
              errors={errors.code?.message}
              register={register('code', USER_AUTH_VALIDATION_RULES.CERTIFICATION)}
            />
          )}

          {/* 인증 요청 및 확인 버튼 */}
          <div className="space-y-8 text-center">
            <VerificationButton
              isVerificationRequested={isVerificationRequested}
              isSubmitting={isSubmitting}
              requestCode={handleSubmit(requestVerificationCode)}
              expireVerificationCode={expireVerificationCode}
              buttonLabel="아이디 찾기"
            />
          </div>
          <FooterLinks type="searchId" />
        </>
      )}
    </AuthFormLayout>
  );
}
