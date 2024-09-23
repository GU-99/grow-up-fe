import { useCallback, useEffect, useRef } from 'react';
import { IoSearch } from 'react-icons/io5';

import type { SearchUser } from '@/types/UserType';
import type { SearchCallback } from '@/types/SearchCallbackType';

type SearchInputProps = {
  id: string;
  label: string;
  keyword: string;
  searchId: number;
  loading: boolean;
  userList: SearchUser[];
  searchCallbackInfo: SearchCallback;
  onKeywordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUserClick: (user: SearchUser) => void;
};

export default function SearchUserInput({
  id,
  label,
  searchId,
  keyword,
  loading,
  userList,
  searchCallbackInfo,
  onKeywordChange: handleKeywordChange,
  onUserClick: handleUserClick,
}: SearchInputProps) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const searchUsers = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const { type, searchCallback } = searchCallbackInfo;

    if (type === 'ALL') searchCallback(keyword, { signal });
    else searchCallback(searchId, keyword, { signal });
  }, [searchCallbackInfo, searchId, keyword]);

  useEffect(() => {
    if (keyword) debounceRef.current = setTimeout(() => searchUsers(), 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [searchUsers, keyword]);

  const handleSearchClick = () => searchUsers();
  const handleSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toLowerCase() === 'enter') {
      e.preventDefault();
      searchUsers();
    }
  };

  return (
    <label htmlFor={id} className="group mb-10 flex items-center gap-5">
      <h3 className="text-large">{label}</h3>
      <section className="relative grow">
        <input
          type="text"
          id={id}
          className="h-25 w-full rounded-md border border-input pl-10 pr-25 text-regular placeholder:text-xs"
          value={keyword}
          onChange={handleKeywordChange}
          onKeyDown={handleSearchKeyUp}
          placeholder="닉네임을 검색해주세요."
        />
        <button
          type="button"
          aria-label="search"
          className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={handleSearchClick}
        >
          <IoSearch className="size-15 text-emphasis hover:text-black" />
        </button>
        {keyword && !loading && (
          <ul className="invisible absolute left-0 right-0 z-10 max-h-110 overflow-auto rounded-md border-2 bg-white group-focus-within:visible">
            {userList.length === 0 ? (
              <div className="h-20 border px-10 leading-8">&apos;{keyword}&apos; 의 검색 결과가 없습니다.</div>
            ) : (
              userList?.map((user) => (
                <li className="h-20 border" key={user.userId}>
                  <button
                    type="button"
                    className="h-full w-full px-10 text-left hover:bg-sub"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.blur();
                      handleUserClick(user);
                    }}
                  >
                    {user.nickname}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </section>
    </label>
  );
}
