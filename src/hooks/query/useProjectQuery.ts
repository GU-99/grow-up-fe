import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateProjectsQueryKey, generateProjectUsersQueryKey } from '@utils/queryKeyGenerator';
import { createProject, deleteProject, getProjectList, getProjectUserRoleList } from '@services/projectService';

import useToast from '@hooks/useToast';
import type { Team } from '@/types/TeamType';
import type { Project, ProjectForm } from '@/types/ProjectType';

// Todo: Project Query CUD로직 작성하기
// 팀에 속한 프로젝트 목록 조회
export function useReadProjects(teamId: Team['teamId']) {
  const {
    data: projectList = [],
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  } = useQuery({
    queryKey: generateProjectsQueryKey(teamId),
    queryFn: async () => {
      const { data } = await getProjectList(teamId);
      return data;
    },
    enabled: !!teamId,
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
    queryKey: generateProjectUsersQueryKey(projectId),
    queryFn: async () => {
      const { data } = await getProjectUserRoleList(projectId);
      return data;
    },
  });

  return { projectUserRoleList, isProjectUserRoleLoading, isErrorProjectUserRole, projectUserRoleError };
}

// 프로젝트 삭제
export function useDeleteProject(teamId: Team['teamId']) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();

  const mutation = useMutation({
    mutationFn: (projectId: Project['projectId']) => deleteProject(projectId),
    onError: () => {
      toastError('프로젝트 삭제를 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      const projectsQueryKey = generateProjectsQueryKey(teamId);
      toastSuccess('프로젝트를 삭제하였습니다.');
      queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });

  return mutation;
}

// 프로젝트 생성
export function useCreateProject(teamId: Team['teamId']) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const projectsQueryKey = generateProjectsQueryKey(teamId);

  const mutation = useMutation({
    mutationFn: (projectData: ProjectForm) => createProject(teamId, projectData),
    onError: (error) => {
      console.log(error);
      toastError('프로젝트 생성을 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('프로젝트를 생성하였습니다.');
      queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });

  return mutation;
}
