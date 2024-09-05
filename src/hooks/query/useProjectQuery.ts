import { useQuery } from '@tanstack/react-query';
import { getProjectList } from '@services/projectService';

import type { Team } from '@/types/TeamType';

// Todo: Project Query CUD로직 작성하기
export default function useReadProjects(teamId: Team['teamId']) {
  const {
    data: projectList = [],
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  } = useQuery({
    queryKey: ['teams', teamId, 'projects'],
    queryFn: async () => {
      const { data } = await getProjectList(teamId);
      return data;
    },
  });

  return { projectList, isProjectLoading, isProjectError, projectError };
}
