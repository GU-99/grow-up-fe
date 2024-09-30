import { useState } from 'react';
import { AxiosError } from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import Spinner from '@components/common/Spinner';
import SearchResultSection from '@components/user/auth-form/SearchResultSection';
import SearchDataForm from '@components/user/auth-form/SearchDataForm';
import AuthFormLayout from '@layouts/AuthFormLayout';
import { searchUserPassword } from '@services/authService';
import useToast from '@hooks/useToast';
import useEmailVerification from '@hooks/useEmailVerification';
import type { SearchPasswordForm } from '@/types/UserType';

export default function SearchPasswordPage() {
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isVerificationRequested, requestVerificationCode, expireVerificationCode } = useEmailVerification();
  const { toastError } = useToast();
  const methods = useForm<SearchPasswordForm>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      verificationCode: '',
    },
  });
  const { handleSubmit, setError, setValue } = methods;

  const emailVerificationProps = {
    isVerificationRequested,
    requestVerificationCode,
    expireVerificationCode,
  };

  // ToDo: useAxios 훅 적용 후 해당 함수 수정 및 삭제하기
  const handleVerificationError = () => {
    setError('verificationCode', {
      type: 'manual',
      message: '인증번호가 일치하지 않습니다.',
    });
    setValue('verificationCode', '');
  };

  // ToDo: useAxios 훅을 이용한 네트워크 로직으로 변경
  const onSubmit = async (data: SearchPasswordForm) => {
    setLoading(true);
    try {
      const fetchData = await searchUserPassword(data);
      setTempPassword(fetchData.data.password);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) handleVerificationError();
        else toastError(error.response.data.message);
      } else {
        toastError('예상치 못한 에러가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <AuthFormLayout onSubmit={handleSubmit(onSubmit)}>
        {loading && <Spinner />}

        {!loading && tempPassword && <SearchResultSection label="임시 비밀번호" result={tempPassword} />}

        {!loading && !tempPassword && <SearchDataForm formType="searchPassword" {...emailVerificationProps} />}
      </AuthFormLayout>
    </FormProvider>
  );
}
