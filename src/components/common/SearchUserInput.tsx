import { IoSearch } from 'react-icons/io5';
import type { UserWithRole } from '@/types/UserType';

type SearchInputProps = {
  id: string;
  label: string;
  keyword: string;
  loading: boolean;
  userList: UserWithRole[];
  onKeywordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchKeyup: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearchClick: () => void;
  onUserClick: (user: UserWithRole) => void;
};

export default function SearchUserInput({
  id,
  label,
  keyword,
  loading,
  userList,
  onKeywordChange: handleKeywordChange,
  onSearchKeyup: handleSearchKeyUp,
  onSearchClick: handleSearchClick,
  onUserClick: handleUserClick,
}: SearchInputProps) {
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
