import type { User } from '@/types/UserType';
import type { Role } from '@/types/RoleType';

export type Assignee = {
  userId: User['userId'];
  nickname: User['nickname'];
  roleName: Role['roleName'];
};
