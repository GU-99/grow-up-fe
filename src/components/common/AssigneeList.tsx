import { IoMdCloseCircle } from 'react-icons/io';
import RoleIcon from '@components/common/RoleIcon';
import type { SearchUser } from '@/types/UserType';

type AssigneeListProps = {
  assigneeList: SearchUser[];
  onAssigneeDeleteClick: (user: SearchUser) => void;
};

export default function AssigneeList({
  assigneeList,
  onAssigneeDeleteClick: handleWorkerDeleteClick,
}: AssigneeListProps) {
  return (
    <section className="flex w-full flex-wrap items-center gap-4">
      {assigneeList.map((user) => (
        <div key={user.userId} className="flex items-center space-x-4 rounded-md bg-button px-5">
          <RoleIcon roleName={user.roleName} />
          <div>{user.nickname}</div>
          <button type="button" aria-label="delete-worker" onClick={() => handleWorkerDeleteClick(user)}>
            <IoMdCloseCircle className="text-close" />
          </button>
        </div>
      ))}
    </section>
  );
}
