import { useState } from 'react';
import { AxiosError } from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import Spinner from '@components/common/Spinner';
import SearchResultSection from '@components/user/auth-form/SearchResultSection';
import SearchDataForm from '@components/user/auth-form/SearchDataForm';
import useToast from '@hooks/useToast';
import AuthFormLayout from '@layouts/AuthFormLayout';
import { searchUserId } from '@services/authService';
import { generateSecureUserId } from '@utils/converter';
import useEmailVerification from '@hooks/useEmailVerification';
import { EmailVerificationForm } from '@/types/UserType';

export default function SearchIdPage() {
  const [searchIdResult, setSearchIdResult] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const { toastError } = useToast();
  const methods = useForm<EmailVerificationForm>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      code: '',
    },
  });
  const { handleSubmit, setError, setValue } = methods;
  const { isVerificationRequested, requestVerificationCode, expireVerificationCode } = useEmailVerification();

  // ToDo: useAxios 훅 적용 후 해당 함수 수정 및 삭제하기
  const handleVerificationError = () => {
    setError('code', {
      type: 'manual',
      message: '인증번호가 일치하지 않습니다.',
    });
    setValue('code', '');
  };

  // ToDo: useAxios 훅을 이용한 네트워크 로직으로 변경
  const onSubmit = async (data: EmailVerificationForm) => {
    setLoading(true);
    try {
      const fetchData = await searchUserId(data);
      setSearchIdResult(fetchData.data.username);
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

        {!loading && searchIdResult && (
          <SearchResultSection label="아이디" result={generateSecureUserId(searchIdResult)} />
        )}

        {!loading && !searchIdResult && (
          <SearchDataForm
            formType="searchId"
            isVerificationRequested={isVerificationRequested}
            requestVerificationCode={requestVerificationCode}
            expireVerificationCode={expireVerificationCode}
          />
        )}
      </AuthFormLayout>
    </FormProvider>
  );
}
