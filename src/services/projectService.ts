import { authAxios } from '@services/axiosProvider';

import type { User } from '@/types/UserType';
import type { Project } from '@/types/ProjectType';

export async function findUserByProject(
  signal: AbortSignal | null,
  projectId: Project['projectId'],
  nickname: User['nickname'],
) {
  const axiosConfig = signal ? { signal } : {};
  return authAxios.get<User[]>(`project/${projectId}/user/search?nickname=${nickname}`, axiosConfig);
}
