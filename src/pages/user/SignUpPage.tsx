import { Link } from 'react-router-dom';
import { GoPlusCircle } from 'react-icons/go';
import { FaRegTrashCan, FaPlus, FaMinus } from 'react-icons/fa6';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { UserSignUp } from '@/types/UserType';
import ValidationInput from '@/components/common/ValidationInput';
import { STATUS_VALIDATION_RULES } from '@/constants/formValidationRules';
import Timer from '@/components/common/Timer';
import reduceImageSize from '@/utils/reduceImageSize';
import { MAX_IMAGE_SIZE } from '@/constants/files';
import useToast from '@/hooks/useToast';
import { MB } from '@/constants/unit';

export default function SignUpPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [link, setLink] = useState<string>('');
  const [linksList, setLinksList] = useState<string[]>([]);
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const { toastSuccess, toastError, toastWarn } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
  } = useForm<UserSignUp>({
    mode: 'onChange',
    defaultValues: {
      userId: '',
      email: '',
      verificationCode: '',
      nickname: '',
      password: '',
      checkPassword: '',
      bio: '',
      links: [''],
    },
  });

  // 이미지 관련 코드
  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE * MB) {
      toastWarn(`최대 ${MAX_IMAGE_SIZE}MB 이하의 이미지 파일만 업로드 가능합니다.`);
      e.target.value = '';
      return;
    }

    setImageUrl(URL.createObjectURL(file));
  };

  const handleRemoveImg = () => {
    setValue('image', '');
    setImageUrl('');
  };

  // 웹사이트 링크 관련 코드
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleAddLink = (newLink: string) => {
    if (newLink.trim() === '') return;
    if (linksList.length === 5) return toastWarn('링크는 최대 5개까지 등록할 수 있습니다.');

    setLinksList([...linksList, newLink.trim()]);
    setValue('links', [...linksList, newLink.trim()]);
    setLink('');
  };

  const handleRemoveLink = (removeLink: string) => {
    const filteredData = linksList.filter((item) => item !== removeLink);
    setLinksList(filteredData);
    setValue('links', filteredData);
  };

  // 이메일 인증번호 요청 함수
  const requestVerificationCode = () => {
    if (!isVerificationRequested) {
      setIsVerificationRequested(true);
      toastSuccess('인증번호가 발송되었습니다. 이메일을 확인해 주세요.');
      setIsTimerVisible(true);
    }
  };

  // 인증번호 확인 함수
  const verifyCode = (verificationCode: string) => {
    if (verificationCode === '1234') {
      // TODO: 실제 API와 연결 시 isVerificationCodeValid 변수를 어떻게 사용할지 생각해보기
      setIsVerificationCodeValid(true);
      return true;
    }

    // 인증번호 불일치
    setIsVerificationCodeValid(false);
    setError('verificationCode', {
      type: 'manual',
      message: '인증번호가 일치하지 않습니다.',
    });
    return false;
  };

  // form 전송 함수
  const onSubmit = async (data: UserSignUp) => {
    const { userId, verificationCode, checkPassword, ...filteredData } = data;

    const verifyResult = verifyCode(verificationCode);
    if (!verifyResult) return toastError('인증번호가 유효하지 않습니다. 다시 시도해 주세요.');

    try {
      // 회원가입 폼
      const formData = { ...filteredData, userId, verificationCode };
      const registrationResponse = await axios.post(`http://localhost:8080/api/v1/user/${userId}`, formData);
      if (registrationResponse.status !== 200) return toastError('회원가입에 실패했습니다. 다시 시도해 주세요.');

      // 이미지 폼
      if (!imageUrl) return toastSuccess('회원가입이 완료되었습니다.');
      const imgFormData = new FormData();
      try {
        const jpeg = await reduceImageSize(imageUrl);
        const file = new File([jpeg], new Date().toISOString(), { type: 'image/jpeg' });
        imgFormData.append('profile', file);
        imgFormData.append('userId', userId);

        const imageResponse = await axios.post(`http://localhost:8080/api/v1/users/file`, imgFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (imageResponse.status !== 200) return toastError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');

        toastSuccess('회원가입이 완료되었습니다.');
      } catch (err) {
        toastError(`이미지 업로드에 실패했습니다: ${err}`);
      }
    } catch (error) {
      toastError(`회원가입 진행 중 오류가 발생했습니다: ${error}`);
    }
  };

  // 타이머 만료
  const handleTimerTimeout = () => {
    setIsTimerVisible(false);
    setIsVerificationRequested(false);
    toastError('인증 시간이 만료되었습니다. 다시 시도해 주세요.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-300 flex-col gap-8">
      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center gap-8">
        <div className="group relative h-100 w-100 overflow-hidden rounded-[50%] border border-input">
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="profileImage" className="h-full w-full object-cover" />
              <div className="absolute inset-0 hidden items-center justify-center bg-black bg-opacity-50 group-hover:flex">
                <p role="presentation" className="cursor-pointer" onClick={handleRemoveImg} onKeyDown={handleRemoveImg}>
                  <FaRegTrashCan size="1.5rem" color="white" />
                </p>
              </div>
            </>
          ) : (
            <label
              htmlFor="image"
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 text-center"
            >
              <input {...register('image')} id="image" type="file" className="hidden" onChange={handleChangeImg} />
              <GoPlusCircle size="1.5rem" color="#5E5E5E" />
            </label>
          )}
        </div>
      </div>

      {/* 아이디 */}
      <ValidationInput
        label="아이디"
        errors={errors.userId?.message}
        register={register('userId', STATUS_VALIDATION_RULES.ID)}
      />

      {/* 이메일 */}
      <ValidationInput
        label="이메일"
        errors={errors.email?.message}
        register={register('email', STATUS_VALIDATION_RULES.EMAIL)}
      />

      {isVerificationRequested && (
        <ValidationInput
          label="인증번호"
          errors={errors.verificationCode?.message}
          register={register('verificationCode', STATUS_VALIDATION_RULES.CERTIFICATION)}
        />
      )}

      {/* 닉네임, 중복 확인 */}
      <ValidationInput
        label="닉네임"
        errors={errors.nickname?.message}
        register={register('nickname', STATUS_VALIDATION_RULES.NICKNAME)}
        isButtonInput
        buttonLabel="중복확인"
      />

      {/* 비밀번호 */}
      <ValidationInput
        label="비밀번호"
        errors={errors.password?.message}
        register={register('password', STATUS_VALIDATION_RULES.PASSWORD)}
        type="password"
      />

      {/* 비밀번호 확인 */}
      <ValidationInput
        label="비밀번호 확인"
        errors={errors.checkPassword?.message}
        register={register('checkPassword', STATUS_VALIDATION_RULES.PASSWORD_CONFIRM(watch('password')))}
        type="password"
      />

      {/* 자기소개 */}
      <div className="flex flex-col">
        <label htmlFor="bio" className="font-bold">
          자기소개
        </label>
        <textarea
          {...register('bio')}
          id="bio"
          placeholder="ex) 안녕하세요. 홍길동입니다."
          className="h-90 grow resize-none rounded-lg border border-input p-8 text-sm outline-none placeholder:text-emphasis"
        />
      </div>

      {/* 링크 */}
      <div>
        <h1 className="font-bold">링크</h1>
        <div className="flex flex-col gap-4">
          {linksList &&
            linksList.map((item) => (
              <div key={item} className="flex h-30 items-center rounded-lg border border-input px-6 text-sm">
                <div className="flex h-full w-full flex-row items-center gap-8">
                  <div className="flex grow items-center overflow-hidden border-transparent bg-inherit">
                    <a href={`http://${item}`} target="_blank" rel="noreferrer">
                      {item}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(item)}
                    className="flex h-20 w-20 items-center justify-center rounded-lg bg-sub px-8 font-bold shadow-md"
                    aria-label="삭제"
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>
            ))}
          <div
            className={`flex h-30 items-center rounded-lg border border-input ${isFocused ? 'bg-white' : 'bg-disable'} px-6 text-sm`}
          >
            <div className="flex h-full w-full flex-row items-center gap-8">
              <input
                placeholder="ex) www.github.com"
                value={link}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleLinkChange}
                type="text"
                className="flex grow bg-inherit outline-none placeholder:text-emphasis"
              />
              <button
                type="button"
                onClick={() => handleAddLink(link)}
                className="flex h-20 w-20 items-center justify-center rounded-lg bg-sub px-8 font-bold shadow-md"
                aria-label="추가"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 인증 요청 및 회원가입 버튼 */}
      <div className="flex flex-col gap-8 text-center">
        {!isVerificationRequested && (
          <button
            type="submit"
            className="relative flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
            onClick={handleSubmit(requestVerificationCode)}
          >
            <span>인증요청</span>
          </button>
        )}
        {isVerificationRequested && (
          <button
            type="submit"
            className="relative flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
            disabled={isSubmitting}
          >
            {isTimerVisible && (
              <div className="absolute left-10">
                <Timer time={180} onTimeout={handleTimerTimeout} />
              </div>
            )}
            <span>회원가입</span>
          </button>
        )}
        <Link to="/signin" className="cursor-pointer font-bold">
          로그인 페이지로 돌아가기
        </Link>
      </div>
    </form>
  );
}
