import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { getProjectNameList } from '@utils/extractDataList';
import ModalLayout from '@layouts/ModalLayout';
import Spinner from '@components/common/Spinner';
import ModalPortal from '@components/modal/ModalPortal';
import ModalButton from '@components/modal/ModalButton';
import PeriodDateInput from '@components/common/PeriodDateInput';
import SearchUserInput from '@components/common/SearchUserInput';
import UserRoleSelectBox from '@components/common/UserRoleSelectBox';
import DescriptionTextarea from '@components/common/DescriptionTextarea';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import { PROJECT_DEFAULT_ROLE, PROJECT_ROLES } from '@constants/role';
import { PROJECT_VALIDATION_RULES } from '@constants/formValidationRules';
import useToast from '@hooks/useToast';
import useAxios from '@hooks/useAxios';
import {
  useReadProjectDetail,
  useReadProjectCoworkers,
  useReadProjects,
  useUpdateProject,
  useAddProjectCoworker,
  useUpdateProjectRole,
  useDeleteProjectUser,
} from '@hooks/query/useProjectQuery';
import { findUserByTeam } from '@services/teamService';

import type { User } from '@/types/UserType';
import type { Team } from '@/types/TeamType';
import type { TeamSearchCallback } from '@/types/SearchCallbackType';
import type { Project, ProjectForm, ProjectInfoForm } from '@/types/ProjectType';
import type { ProjectRoleName } from '@/types/RoleType';

type UpdateModalProjectProps = {
  projectId: Project['projectId'];
  onClose: () => void;
};

export default function UpdateModalProject({ projectId, onClose: handleClose }: UpdateModalProjectProps) {
  const updateProjectFormId = 'updateProjectForm';
  const [keyword, setKeyword] = useState('');
  const { toastInfo } = useToast();
  const { teamId } = useParams();
  const { projectCoworkers, isProjectCoworkersLoading } = useReadProjectCoworkers(projectId);
  const { projectList, isProjectLoading } = useReadProjects(Number(teamId));
  const { projectInfo, isLoading: isProjectInfoLoading } = useReadProjectDetail(Number(teamId), projectId);
  const projectNameList = useMemo(
    () => getProjectNameList(projectList, projectInfo?.projectName),
    [projectList, projectInfo?.projectName],
  );

  const { mutate: deleteProjectUserMutate } = useDeleteProjectUser(projectId);
  const { mutate: updateProjectMutate } = useUpdateProject(Number(teamId));
  const { mutate: addProjectCoworkerMutate } = useAddProjectCoworker(projectId);
  const { mutate: updateProjectCoworkerRoleMutate } = useUpdateProjectRole(projectId);
  const { loading, data: userList = [], clearData, fetchData } = useAxios(findUserByTeam);

  const searchCallbackInfo: TeamSearchCallback = useMemo(
    () => ({
      type: 'TEAM',
      searchCallback: (teamId: Team['teamId'], nickname: User['nickname']) => {
        return fetchData(Number(teamId), nickname);
      },
    }),
    [fetchData],
  );

  const methods = useForm<ProjectForm>({ mode: 'onChange' });
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (projectInfo) {
      reset({
        projectName: projectInfo.projectName,
        content: projectInfo.content,
        startDate: projectInfo.startDate.toISOString().split('T')[0],
        endDate: projectInfo.endDate ? projectInfo.endDate.toISOString().split('T')[0] : null,
      });
    }
  }, [projectInfo, reset]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value.trim());
  };

  const handleCoworkersClick = (userId: User['userId'], roleName: ProjectRoleName) => {
    const isIncludedUser = projectCoworkers.find((coworker) => coworker.userId === userId);
    if (isIncludedUser) return toastInfo('이미 포함된 프로젝트 멤버입니다');

    addProjectCoworkerMutate({ userId, roleName });
    setKeyword('');
    clearData();
  };

  const handleRoleChange = (userId: User['userId'], roleName: ProjectRoleName) => {
    updateProjectCoworkerRoleMutate({ userId, roleName });
  };

  const handleFormSubmit: SubmitHandler<ProjectInfoForm> = (formData) => {
    updateProjectMutate({ projectId, formData });
    handleClose();
  };

  const handleRemoveUser = (userId: User['userId']) => {
    deleteProjectUserMutate(userId);
  };

  if (isProjectInfoLoading || isProjectCoworkersLoading || isProjectLoading) {
    return <Spinner />;
  }

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <FormProvider {...methods}>
          <form id={updateProjectFormId} onSubmit={handleSubmit(handleFormSubmit)}>
            <DuplicationCheckInput
              id="projectName"
              label="프로젝트 명"
              value={watch('projectName')}
              placeholder="프로젝트명을 입력해주세요."
              errors={errors.projectName?.message}
              register={register('projectName', PROJECT_VALIDATION_RULES.PROJECT_NAME(projectNameList))}
            />

            <DescriptionTextarea
              id="content"
              label="프로젝트 설명"
              fieldName="content"
              placeholder="프로젝트 내용을 입력해주세요."
              validationRole={PROJECT_VALIDATION_RULES.PROJECT_DESCRIPTION}
              errors={errors.content?.message}
            />

            <PeriodDateInput
              startDateLabel="시작일"
              endDateLabel="종료일"
              startDateId="startDate"
              endDateId="endDate"
              startDateFieldName="startDate"
              endDateFieldName="endDate"
            />
          </form>
        </FormProvider>

        <ModalButton formId={updateProjectFormId} color="text-white" backgroundColor="bg-main">
          수정
        </ModalButton>
        <div className="my-16">
          <SearchUserInput
            id="search"
            label="팀원"
            keyword={keyword}
            loading={loading}
            userList={userList}
            searchId={Number(teamId)}
            searchCallbackInfo={searchCallbackInfo}
            onKeywordChange={handleKeywordChange}
            onUserClick={(user) => handleCoworkersClick(user.userId, PROJECT_DEFAULT_ROLE)}
          />
          <div className="flex flex-wrap">
            {projectCoworkers.map(({ userId, nickname, roleName }) => (
              <UserRoleSelectBox
                key={userId}
                userId={userId}
                nickname={nickname}
                roles={PROJECT_ROLES}
                defaultValue={roleName as ProjectRoleName}
                onRoleChange={handleRoleChange}
                onRemoveUser={handleRemoveUser}
              />
            ))}
          </div>
        </div>
      </ModalLayout>
    </ModalPortal>
  );
}
