import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import RoleTooltip from '@components/common/RoleTooltip';
import { PROJECT_ROLE_INFO, PROJECT_ROLES } from '@constants/role';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import DescriptionTextarea from '@components/common/DescriptionTextarea';
import { PROJECT_VALIDATION_RULES } from '@constants/formValidationRules';
import PeriodDateInput from '@components/common/PeriodDateInput';
import SearchUserInput from '@components/common/SearchUserInput';
import UserRoleSelectBox from '@components/common/UserRoleSelectBox';
import useAxios from '@hooks/useAxios';
import useToast from '@hooks/useToast';
import { findUserByTeam } from '@services/teamService';
import { useParams } from 'react-router-dom';
import type { SubmitHandler } from 'react-hook-form';
import type { TeamSearchCallback } from '@/types/SearchCallbackType';
import type { ProjectRoleName } from '@/types/RoleType';
import type { Project, ProjectCoworker, ProjectForm } from '@/types/ProjectType';
import type { SearchUser, User } from '@/types/UserType';

type ModalProjectFormProps = {
  formId: string;
  onSubmit: SubmitHandler<ProjectForm>;
};

export default function ModalProjectForm({ formId, onSubmit }: ModalProjectFormProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [coworkerInfos, setCoworkerInfos] = useState<ProjectCoworker[]>([]);
  const { toastInfo } = useToast();
  const { teamId: teamIdString } = useParams();
  const teamId = Number(teamIdString);
  const { loading, data: userList = [], clearData, fetchData } = useAxios(findUserByTeam);

  const searchCallbackInfo: TeamSearchCallback = useMemo(
    () => ({
      type: 'TEAM',
      searchCallback: (teamId: number, nickname: User['nickname']) => {
        return fetchData(teamId, nickname);
      },
    }),
    [fetchData],
  );

  const methods = useForm<ProjectForm>({
    mode: 'onChange',
    defaultValues: {
      projectName: '',
      content: '',
      startDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
      endDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
      coworkers: [],
    },
  });

  const {
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
    register,
  } = methods;

  const handleRoleChange = (userId: User['userId'], roleName: ProjectRoleName) => {
    const updatedCoworkerInfos = coworkerInfos.map((coworkerInfo) =>
      coworkerInfo.userId === userId ? { ...coworkerInfo, roleName } : coworkerInfo,
    );

    const updatedCoworkers = updatedCoworkerInfos.map(({ userId, roleName, nickname }) => ({
      userId,
      roleName,
      nickname,
    }));

    setValue('coworkers', updatedCoworkers);
    setCoworkerInfos(updatedCoworkerInfos);
  };

  const handleRemoveUser = (userId: User['userId']) => {
    const filteredCoworkerInfos = coworkerInfos.filter((coworkerInfo) => coworkerInfo.userId !== userId);
    const filteredCoworkers = filteredCoworkerInfos.map(({ userId, roleName, nickname }) => ({
      userId,
      roleName,
      nickname,
    }));

    setValue('coworkers', filteredCoworkers);
    setCoworkerInfos(filteredCoworkerInfos);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value.trim());
  };

  const handleCoworkersClick = (user: SearchUser) => {
    const isIncludedUser = coworkerInfos.find((coworkerInfo) => coworkerInfo.userId === user.userId);
    if (isIncludedUser) return toastInfo('이미 포함된 팀원입니다');

    const updatedCoworkerInfos: ProjectCoworker[] = [
      ...coworkerInfos,
      { userId: user.userId, nickname: user.nickname, roleName: 'ASSIGNEE' },
    ];
    const updatedCoworkers = updatedCoworkerInfos.map(({ userId, roleName, nickname }) => ({
      userId,
      roleName,
      nickname,
    }));
    setCoworkerInfos(updatedCoworkerInfos);
    setValue('coworkers', updatedCoworkers);
    setKeyword('');
    clearData();
  };

  const handleSubmitForm: SubmitHandler<ProjectForm> = (formData: ProjectForm) => onSubmit(formData);

  return (
    <FormProvider {...methods}>
      <form id={formId} className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
          <p className="text-sky-700">
            <strong>프로젝트 권한 정보</strong>
          </p>
          <RoleTooltip showTooltip={showTooltip} rolesInfo={PROJECT_ROLE_INFO} />
        </div>

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

        <SearchUserInput
          id="search"
          label="팀원"
          keyword={keyword}
          loading={loading}
          userList={userList}
          searchId={teamId}
          searchCallbackInfo={searchCallbackInfo}
          onKeywordChange={handleKeywordChange}
          onUserClick={handleCoworkersClick}
        />
        <div className="flex flex-wrap">
          {coworkerInfos.map(({ userId, nickname }) => (
            <UserRoleSelectBox
              key={userId}
              userId={userId}
              nickname={nickname}
              roles={PROJECT_ROLES}
              defaultValue="ASSIGNEE"
              onRoleChange={handleRoleChange}
              onRemoveUser={handleRemoveUser}
            />
          ))}
        </div>
      </form>
    </FormProvider>
  );
}
