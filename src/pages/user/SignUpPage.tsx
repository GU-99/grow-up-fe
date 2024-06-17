import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/constants/regex';

type FormData = {
  email: string;
  verificationCode: string;
  name: string;
  password: string;
  checkPassword: string;
  bio: string;
  website: string[];
};

export default function SignUpPage() {
  const [link, setLink] = useState<string>('');
  const [websiteList, setWebsiteList] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      verificationCode: '',
      name: '',
      password: '',
      checkPassword: '',
      bio: '',
      website: [''],
    },
  });

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleAddLink = (newLink: string) => {
    if (newLink.trim() === '') {
      return;
    }
    setWebsiteList([...websiteList, newLink.trim()]);
    setValue('website', [...websiteList, newLink.trim()]);
    setLink('');
  };

  const handleRemoveLink = (idx: number) => {
    const filteredData = websiteList.filter((_, index) => index !== idx);
    setWebsiteList(filteredData);
    setValue('website', filteredData);
  };

  const onSubmit = (data: FormData) => {
    const { verificationCode, checkPassword, ...filteredData } = data;
    console.log(filteredData);
  };

  return (
    <div className="flex flex-col p-10 bg-[#237700] rounded-2xl h-[90vh] overflow-y-scroll scrollbar-hide border border-[#A9A9A9] shadow-xl shadow-gray-500/50">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-y-4">
        <div className="flex flex-col items-center gap-y-4">
          <div className="w-[15.63rem] h-[15.63rem]">
            <img
              src="https://blog.kakaocdn.net/dn/tEMUl/btrDc6957nj/NwJoDw0EOapJNDSNRNZK8K/img.jpg"
              alt="img"
              className="w-full h-full object-cover rounded-[50%]"
            />
          </div>
          <div className="flex flex-row gap-x-2">
            <label
              htmlFor="file-upload"
              className="w-[6.25rem] h-[4.38rem] bg-[#E1F4D9] rounded-[10px] sm:text-m font-bold flex items-center justify-center cursor-pointer auth-btn"
            >
              등록
              <input id="file-upload" type="file" className="hidden" />
            </label>
            <button type="button" className="w-[6.25rem] auth-btn bg-[#EFEFEF]">
              삭제
            </button>
          </div>
        </div>

        <div className="flex flex-row gap-x-2">
          <input
            {...register('email', {
              required: '이메일(아이디)을 입력해 주세요.',
              pattern: {
                value: EMAIL_REGEX,
                message: '이메일 형식에 맞지 않습니다.',
              },
            })}
            type="email"
            placeholder="(필수) 이메일(아이디)을 입력하세요."
            className={`w-[20.63rem] auth-input ${errors.email && `border-2 border-[#FF0000]`}`}
          />
          <button type="button" className="w-[10rem] auth-btn">
            인증번호 발송
          </button>
        </div>
        {errors.email && <p className="text-[#FF0000] text-sm">{errors.email.message}</p>}

        <div className="flex flex-row gap-x-2">
          <input
            {...register('verificationCode', { required: '인증번호를 입력해 주세요.' })}
            placeholder="(필수) 인증번호를 입력하세요."
            type="text"
            id="verificationCode"
            className={`w-[24.38rem] auth-input ${errors.verificationCode && `border-2 border-[#FF0000]`}`}
          />
          <button type="button" className="w-[6.25rem] auth-btn">
            확인
          </button>
        </div>
        {errors.verificationCode && <p className="text-[#FF0000] text-sm">{errors.verificationCode.message}</p>}

        <div className="flex flex-row gap-x-2">
          <input
            {...register('name', {
              required: '닉네임을 입력해 주세요.',
              maxLength: {
                value: 20,
                message: '닉네임은 최대 20자까지 입력 가능합니다.',
              },
            })}
            placeholder="(필수) 닉네임을 입력하세요."
            type="text"
            id="name"
            className={`w-[21.88rem] auth-input ${errors.name && `border-2 border-[#FF0000]`}`}
          />
          <button type="button" className="w-[8.75rem] auth-btn">
            중복확인
          </button>
        </div>
        {errors.name && <p className="text-[#FF0000] text-sm">{errors.name.message}</p>}

        <input
          {...register('password', {
            required: '비밀번호를 입력해 주세요.',
            minLength: {
              value: 8,
              message: '비밀번호는 최소 8자 이상이어야 합니다.',
            },
            maxLength: {
              value: 16,
              message: '비밀번호는 최대 16자 이하여야 합니다.',
            },
            pattern: {
              value: PASSWORD_REGEX,
              message: '비밀번호는 영문자, 숫자, 기호를 포함해야 합니다.',
            },
          })}
          placeholder="(필수) 비밀번호를 입력하세요. (영문자, 숫자, 기호 포함 8~16자리)"
          type="password"
          id="password"
          className={`auth-input ${errors.password && `border-2 border-[#FF0000]`}`}
        />
        {errors.password && <p className="text-[#FF0000] text-sm">{errors.password.message}</p>}

        <input
          {...register('checkPassword', {
            required: '비밀번호를 한 번 더 입력해 주세요.',
            validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.',
          })}
          placeholder="(필수) 비밀번호를 한 번 더 입력해 주세요."
          type="password"
          id="checkPassword"
          className={`auth-input ${errors.checkPassword && `border-2 border-[#FF0000]`}`}
        />
        {errors.checkPassword && <p className="text-[#FF0000] text-sm">{errors.checkPassword.message}</p>}

        <input
          {...register('bio')}
          placeholder="(선택) 자신을 소개해 주세요."
          type="text"
          id="bio"
          className="h-[9.38rem] auth-input"
        />

        {websiteList &&
          websiteList.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="flex flex-row gap-x-2">
              <div className="w-[26.31rem] auth-input flex items-center">
                <a href={`http://${item}`} target="_blank" className="underline underline-offset-4" rel="noreferrer">
                  {item}
                </a>
              </div>
              <button type="button" onClick={() => handleRemoveLink(index)} className="w-[4.38rem] auth-btn">
                -
              </button>
            </div>
          ))}

        <div className="flex flex-row gap-x-2">
          <input
            placeholder="(선택) 링크를 추가해 보세요.(GitHub, Blog 등)"
            value={link}
            onChange={handleLinkChange}
            type="text"
            className="w-[26.31rem] auth-input bg-[#C2C2C2]"
          />
          <button type="button" onClick={() => handleAddLink(link)} className="w-[4.38rem] auth-btn">
            +
          </button>
        </div>

        <div className="flex flex-col gap-y-4 text-center">
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            회원가입
          </button>

          <p className="sm:text-m font-bold text-[#E1F4D9] cursor-pointer">로그인 페이지로 돌아가기</p>
        </div>
      </form>
    </div>
  );
}
