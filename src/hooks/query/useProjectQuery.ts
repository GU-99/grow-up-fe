import { useQuery } from '@tanstack/react-query';
import { getProjectList, getProjectUserRoleList } from '@services/projectService';

import type { Team } from '@/types/TeamType';
import type { Project } from '@/types/ProjectType';

// Todo: Project Query CUD로직 작성하기
// 팀에 속한 프로젝트 목록 조회
export function useReadProjects(teamId: Team['teamId']) {
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

// 프로젝트 팀원 목록 조회
export function useReadProjectUserRoleList(projectId: Project['projectId']) {
  const {
    data: projectUserRoleList = [],
    isLoading: isProjectUserRoleLoading,
    isError: isErrorProjectUserRole,
    error: projectUserRoleError,
  } = useQuery({
    queryKey: ['projects', projectId, 'users'],
    queryFn: async () => {
      const { data } = await getProjectUserRoleList(projectId);
      return data;
    },
  });

  return { projectUserRoleList, isProjectUserRoleLoading, isErrorProjectUserRole, projectUserRoleError };
}
