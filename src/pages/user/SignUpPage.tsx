import { Link } from 'react-router-dom';
import { GoPlusCircle } from 'react-icons/go';
import { FaRegTrashCan, FaPlus, FaMinus } from 'react-icons/fa6';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserSignUp } from '@/types/UserType';
import ValidationInput from '@/components/common/ValidationInput';
import { STATUS_VALIDATION_RULES } from '@/constants/formValidationRules';
import Timer from '@/components/common/Timer';

export default function SignUpPage() {
  const [imagePreview, setImagePreview] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [link, setLink] = useState<string>('');
  const [linksList, setLinksList] = useState<string[]>([]);
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);

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
      id: '',
      email: '',
      emailVerificationCode: '',
      nickname: '',
      password: '',
      checkPassword: '',
      bio: '',
      links: [''],
    },
  });

  // 이미지 미리보기 관련 코드
  const profileImage = watch('image');
  useEffect(() => {
    if (profileImage && profileImage.length > 0) {
      const file = profileImage[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [profileImage]);

  const handleRemoveImg = () => {
    setValue('image', []);
    setImagePreview('');
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
    if (newLink.trim() === '') {
      return;
    }

    if (linksList.length === 3) {
      alert('링크는 최대 3개까지 등록할 수 있습니다.');
      return;
    }

    setLinksList([...linksList, newLink.trim()]);
    setValue('links', [...linksList, newLink.trim()]);
    setLink('');
  };

  const handleRemoveLink = (removeLink: string) => {
    const filteredData = linksList.filter((item) => item !== removeLink);
    setLinksList(filteredData);
    setValue('links', filteredData);
  };

  // form 전송 함수
  const onSubmit = (data: UserSignUp) => {
    const { emailVerificationCode, checkPassword, ...filteredData } = data;

    // 이메일 인증번호 요청 로직
    if (!isVerificationRequested) {
      setIsVerificationRequested(true);
      alert('인증번호가 발송되었습니다. 이메일을 확인해 주세요.');
      setIsTimerVisible(true);
      return;
    }

    // 인증 코드 확인 후 form 전송 로직
    if (emailVerificationCode === '1234') {
      setIsVerificationCodeValid(true);
      console.log(filteredData);
      return;
    }

    // 인증 실패 시 로직
    setIsVerificationCodeValid(false);
    setError('emailVerificationCode', {
      type: 'manual',
      message: '인증번호가 일치하지 않습니다.',
    });
  };

  // 타이머 만료
  const handleTimerTimeout = () => {
    setIsTimerVisible(false);
    setIsVerificationRequested(false);
    alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-300 flex-col gap-8">
      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center gap-8">
        <div className="group relative h-100 w-100 overflow-hidden rounded-[50%] border border-input">
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="profileImage" className="h-full w-full object-cover" />
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
              <input {...register('image')} id="image" type="file" className="hidden" />
              <GoPlusCircle size="1.5rem" color="#5E5E5E" />
            </label>
          )}
        </div>
      </div>

      {/* 아이디 */}
      <ValidationInput
        label="아이디"
        errors={errors.id?.message}
        register={register('id', STATUS_VALIDATION_RULES.ID)}
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
          errors={errors.emailVerificationCode?.message}
          register={register('emailVerificationCode', STATUS_VALIDATION_RULES.CERTIFICATION)}
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
        register={register('checkPassword', {
          ...STATUS_VALIDATION_RULES.PASSWORD_CONFIRM(watch('password')),
        })}
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

      {/* 회원가입 버튼 */}
      <div className="flex flex-col gap-8 text-center">
        <button
          type="submit"
          className="relative flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
          disabled={isSubmitting || (!isVerificationRequested && isVerificationCodeValid)}
        >
          {isTimerVisible && (
            <div className="absolute left-10">
              <Timer time={180} onTimeout={handleTimerTimeout} />
            </div>
          )}
          <span>{isVerificationRequested ? '회원가입' : '인증요청'}</span>
        </button>
        <Link to="/signin" className="cursor-pointer font-bold">
          로그인 페이지로 돌아가기
        </Link>
      </div>
    </form>
  );
}
