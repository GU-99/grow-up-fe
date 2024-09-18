import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import ValidationInput from '@components/common/ValidationInput';
import FooterLinks from '@components/user/auth-form/FooterLinks';
import VerificationButton from '@components/user/auth-form/VerificationButton';
import Spinner from '@components/common/Spinner';
import useEmailVerification from '@hooks/useEmailVerification';
import AuthFormLayout from '@layouts/AuthFormLayout';
import { searchUserPassword } from '@services/authService';
import useToast from '@hooks/useToast';
import type { SearchPasswordForm } from '@/types/UserType';

export default function SearchPasswordPage() {
  const { isVerificationRequested, requestVerificationCode, expireVerificationCode } = useEmailVerification();
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toastError } = useToast();
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchPasswordForm>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      code: '',
    },
  });

  // ToDo: useAxios 훅을 이용한 네트워크 로직으로 변경
  const onSubmit = async (data: SearchPasswordForm) => {
    setLoading(true);
    try {
      const fetchData = await searchUserPassword(data);
      setTempPassword(fetchData.data.password);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toastError(error.response.data.message);
      } else {
        toastError('예상치 못한 에러가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout onSubmit={handleSubmit(onSubmit)}>
      {loading && <Spinner />}

      {!loading && tempPassword && (
        <div className="space-y-20 text-center">
          <div className="space-y-5">
            <p>임시 비밀번호</p>
            <p>
              <b>{tempPassword}</b>
            </p>
          </div>
          <button type="button" className="auth-btn w-full" onClick={() => nav('/signin')}>
            로그인으로 돌아가기
          </button>
        </div>
      )}

      {!loading && !tempPassword && (
        <>
          {/* 아이디 */}
          <ValidationInput
            placeholder="아이디"
            errors={errors.username?.message}
            register={register('username', USER_AUTH_VALIDATION_RULES.ID)}
          />

          {/* 이메일 */}
          <ValidationInput
            placeholder="이메일"
            errors={errors.email?.message}
            register={register('email', USER_AUTH_VALIDATION_RULES.EMAIL)}
          />

          {/* 이메일 인증 */}
          {isVerificationRequested && (
            <ValidationInput
              placeholder="인증번호"
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
              buttonLabel="비밀번호 찾기"
            />
          </div>
          <FooterLinks type="searchPassword" />
        </>
      )}
    </AuthFormLayout>
  );
}
