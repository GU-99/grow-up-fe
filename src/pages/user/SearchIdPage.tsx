import { useState } from 'react';
import { AxiosError } from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import Spinner from '@components/common/Spinner';
import SearchResultSection from '@components/user/auth-form/SearchResultSection';
import SearchDataForm from '@components/user/auth-form/SearchDataForm';
import useEmailVerification from '@hooks/useEmailVerification';
import useToast from '@hooks/useToast';
import AuthFormLayout from '@layouts/AuthFormLayout';
import { searchUserId } from '@services/authService';
import { generateSecureUserId } from '@utils/converter';
import { EmailVerificationForm } from '@/types/UserType';

export default function SearchIdPage() {
  const { verifyCode } = useEmailVerification();
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
  const { watch, handleSubmit, setError } = methods;

  // ToDo: useAxios 훅을 이용한 네트워크 로직으로 변경
  const onSubmit = async (data: EmailVerificationForm) => {
    const verifyResult = verifyCode(watch('code'), setError);
    if (!verifyResult) return;

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

        {!loading && !searchIdResult && <SearchDataForm formType="searchId" />}
      </AuthFormLayout>
    </FormProvider>
  );
}
