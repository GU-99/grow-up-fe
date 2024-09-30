import React from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import type { SearchUser } from '@/types/UserType';
import type { RoleName } from '@/types/RoleType';

type SelectedUserWithRoleProps<T extends RoleName> = {
  user: SearchUser;
  roles: readonly { value: T; label: string }[];
  defaultValue?: T;
  onRoleChange: (userId: number, role: T) => void;
  onRemoveUser: (userId: number) => void;
};

export default function SelectedUserWithRole<T extends RoleName>({
  user,
  roles,
  defaultValue,
  onRoleChange,
  onRemoveUser,
}: SelectedUserWithRoleProps<T>) {
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onRoleChange(user.userId, event.target.value as T);
  };

  return (
    <div className="ml-4 mt-4 flex items-center text-sm">
      <select
        onChange={handleRoleChange}
        className="mr-2 appearance-none rounded-l-lg border-none bg-gray-200 py-2 pl-4 pr-2"
        defaultValue={defaultValue}
      >
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>

      <div className="flex items-center justify-between rounded-r-lg bg-gray-200 p-2">
        <span>{user.nickname}</span>
        <button type="button" className="ml-2" onClick={() => onRemoveUser(user.userId)} aria-label="유저 제거">
          <IoMdCloseCircle className="size-10 cursor-pointer text-close hover:text-[#DF0000]" />
        </button>
      </div>
    </div>
  );
}
