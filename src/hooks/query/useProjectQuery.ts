import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateProjectsQueryKey, generateProjectUsersQueryKey } from '@utils/queryKeyGenerator';
import {
  addProjectCoworker,
  createProject,
  deleteProject,
  getProjectList,
  getProjectUserRoleList,
  updateProjectInfo,
  updateProjectRole,
} from '@services/projectService';

import useToast from '@hooks/useToast';
import { useMemo } from 'react';
import type { Team } from '@/types/TeamType';
import type { Project, ProjectCoworkerForm, ProjectForm, ProjectInfoForm } from '@/types/ProjectType';
import type { ProjectRoleName } from '@/types/RoleType';
import type { User } from '@/types/UserType';

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

// 특정 프로젝트 목록 조회
export function useReadProjectDetail(teamId: Team['teamId'], projectId: Project['projectId']) {
  const { projectList, isProjectLoading, isProjectError, projectError } = useReadProjects(teamId);

  const projectInfo = useMemo(() => {
    return projectList.find((project) => project.projectId === projectId);
  }, [projectList, projectId]);

  return {
    projectInfo,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  };
}

// 프로젝트 팀원 목록 조회
export function useReadProjectCoworkers(projectId: Project['projectId']) {
  const {
    data: projectCoworkers = [],
    isLoading: isProjectCoworkersLoading,
    isError: isProjectCoworkersError,
    error: projectCoworkersError,
  } = useQuery({
    queryKey: generateProjectUsersQueryKey(projectId),
    queryFn: async () => {
      const { data } = await getProjectUserRoleList(projectId);
      return data;
    },
  });

  return { projectCoworkers, isProjectCoworkersLoading, isProjectCoworkersError, projectCoworkersError };
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
    onError: () => {
      toastError('프로젝트 생성을 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('프로젝트를 생성하였습니다.');
      queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });

  return mutation;
}
// 프로젝트 수정
export function useUpdateProject(teamId: Project['teamId']) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const projectsQueryKey = generateProjectsQueryKey(teamId);

  const mutation = useMutation({
    mutationFn: ({ projectId, formData }: { projectId: Project['projectId']; formData: ProjectInfoForm }) =>
      updateProjectInfo(teamId, projectId, formData),
    onError: () => {
      toastError('프로젝트 수정을 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('프로젝트를 수정하였습니다.');
      queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });

  return mutation;
}

// 프로젝트 인원 추가
export function useAddProjectCoworker(projectId: Project['projectId']) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const projectUsersQueryKey = generateProjectUsersQueryKey(projectId);

  const mutation = useMutation({
    mutationFn: ({ userId, roleName }: ProjectCoworkerForm) => addProjectCoworker(projectId, userId, roleName),
    onError: () => {
      toastError('유저 초대에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('유저를 성공적으로 초대했습니다.');
      queryClient.invalidateQueries({ queryKey: projectUsersQueryKey });
    },
  });

  return mutation;
}

// 프로젝트 유저 권한 변경
export function useUpdateProjectRole(projectId: Project['projectId']) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const projectUsersQueryKey = generateProjectUsersQueryKey(projectId);

  const mutation = useMutation({
    mutationFn: ({ userId, roleName }: ProjectCoworkerForm) => updateProjectRole(projectId, userId, roleName),
    onError: () => {
      toastError('유저 권한 업데이트에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('유저 권한을 성공적으로 업데이트했습니다.');
      queryClient.invalidateQueries({ queryKey: projectUsersQueryKey });
    },
  });

  return mutation;
}
