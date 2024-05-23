import { useState } from 'react';

export default function SignUp() {
  const [form, setForm] = useState([]);

  return (
    <div>
      <div className="flex">
        <form>
          <h1>프로필 사진</h1>
          <img
            src="https://blog.kakaocdn.net/dn/tEMUl/btrDc6957nj/NwJoDw0EOapJNDSNRNZK8K/img.jpg"
            alt="img"
            className="w-32"
          />
          <input type="file" />
          <h1>이메일</h1>
          <input
            type="text"
            name="email"
            id="email"
            required
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <button type="button" className="bg-gray-400 rounded-md">
            인증 요청
          </button>
          <h1>비밀번호</h1>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <h1>자기소개</h1>
          <input
            type="text"
            name="bio"
            id="bio"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <h1>링크(블로그, 깃허브)</h1>
          <input
            type="text"
            name="website"
            id="website"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <h1>소속</h1>
          <input
            type="text"
            name="company"
            id="company"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </form>
      </div>
    </div>
  );
}
