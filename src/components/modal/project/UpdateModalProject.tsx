import ModalPortal from '@components/modal/ModalPortal';
import ModalLayout from '@layouts/ModalLayout';
import ModalButton from '@components/modal/ModalButton';

import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import PeriodDateInput from '@components/common/PeriodDateInput';
import DescriptionTextarea from '@components/common/DescriptionTextarea';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import SearchUserInput from '@components/common/SearchUserInput';
import UserRoleSelectBox from '@components/common/UserRoleSelectBox';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PROJECT_VALIDATION_RULES } from '@constants/formValidationRules';
import { findUserByTeam } from '@services/teamService';
import useAxios from '@hooks/useAxios';
import { PROJECT_DEFAULT_ROLE, PROJECT_ROLES } from '@constants/role';
import Spinner from '@components/common/Spinner';
import type { User } from '@/types/UserType';
import type { Team } from '@/types/TeamType';
import type { TeamSearchCallback } from '@/types/SearchCallbackType';
import type { Project, ProjectForm } from '@/types/ProjectType';

import { useReadProjectUserRoleList, useReadProjectDetail } from '@/hooks/query/useProjectQuery';

type UpdateModalProjectProps = {
  projectId: Project['projectId'];
  onClose: () => void;
};

export default function UpdateModalProject({ projectId, onClose: handleClose }: UpdateModalProjectProps) {
  const updateProjectFormId = 'updateProjectForm';
  const { teamId } = useParams();
  const [keyword, setKeyword] = useState('');

  const { projectInfo, isLoading: isProjectLoading } = useReadProjectDetail(Number(teamId), projectId);
  const { projectUserRoleList: coworkers, isProjectUserRoleLoading: isProjectCoworkersLoading } =
    useReadProjectUserRoleList(projectId);

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

  const handleFormSubmit: SubmitHandler<ProjectForm> = async (data) => {
    handleClose();
  };

  if (isProjectLoading) {
    return <Spinner />;
  }

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <FormProvider {...methods}>
          <form id="updateTeamForm" onSubmit={handleSubmit(handleFormSubmit)}>
            <DuplicationCheckInput
              id="projectName"
              label="프로젝트 명"
              value={watch('projectName')}
              placeholder="프로젝트명을 입력해주세요."
              errors={errors.projectName?.message}
              register={register('projectName', PROJECT_VALIDATION_RULES.PROJECT_NAME)}
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
            onUserClick={() => {}} // 팀원 추가 클릭 핸들러
          />
          <div className="flex flex-wrap">
            {coworkers.map(({ userId, nickname }) => (
              <UserRoleSelectBox
                key={userId}
                userId={userId}
                nickname={nickname}
                roles={PROJECT_ROLES}
                defaultValue={PROJECT_DEFAULT_ROLE}
                onRoleChange={() => {}} // 역할 변경 핸들러
                onRemoveUser={() => {}} // 팀원 삭제 핸들러
              />
            ))}
          </div>
        </div>
      </ModalLayout>
    </ModalPortal>
  );
}
