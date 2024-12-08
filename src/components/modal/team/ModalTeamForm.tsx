import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useAxios from '@hooks/useAxios';
import useToast from '@hooks/useToast';
import { useReadTeams } from '@hooks/query/useTeamQuery';
import { TEAM_CREATE_ROLES, TEAM_DEFAULT_ROLE, TEAM_ROLE_INFO } from '@constants/role';
import { TEAM_VALIDATION_RULES } from '@constants/formValidationRules';
import { findUser } from '@services/userService';
import Spinner from '@components/common/Spinner';
import RoleTooltip from '@components/common/RoleTooltip';
import SearchUserInput from '@components/common/SearchUserInput';
import UserRoleSelectBox from '@components/common/UserRoleSelectBox';
import DescriptionTextarea from '@components/common/DescriptionTextarea';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import { getTeamNameList } from '@utils/extractDataList';

import type { SubmitHandler } from 'react-hook-form';
import type { SearchUser, User } from '@/types/UserType';
import type { TeamRoleName } from '@/types/RoleType';
import type { TeamCoworker, TeamForm } from '@/types/TeamType';
import type { AllSearchCallback } from '@/types/SearchCallbackType';

type ModalTeamFormProps = {
  formId: string;
  onSubmit: SubmitHandler<TeamForm>;
};

export default function ModalTeamForm({ formId, onSubmit }: ModalTeamFormProps) {
  const [keyword, setKeyword] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [coworkerInfos, setCoworkerInfos] = useState<TeamCoworker[]>([]);
  const { loading, data: userList = [], clearData, fetchData } = useAxios(findUser);
  const { toastInfo } = useToast();

  const { teamList, isLoading: isTeamListLoading } = useReadTeams();
  const teamNameList = useMemo(() => getTeamNameList(teamList), [teamList]);

  const searchCallbackInfo: AllSearchCallback = useMemo(
    () => ({ type: 'ALL', searchCallback: fetchData }),
    [fetchData],
  );

  const methods = useForm<TeamForm>({
    mode: 'onChange',
    defaultValues: {
      teamName: '',
      content: '',
      coworkers: [],
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const handleRoleChange = (userId: User['userId'], roleName: TeamRoleName) => {
    const updatedCoworkerInfos = coworkerInfos.map((coworkerInfo) =>
      coworkerInfo.userId === userId ? { ...coworkerInfo, roleName } : coworkerInfo,
    );
    const updatedCoworkers = updatedCoworkerInfos.map(({ userId, roleName }) => ({
      userId,
      roleName,
    }));
    setValue('coworkers', updatedCoworkers);
    setCoworkerInfos(updatedCoworkerInfos);
  };

  const handleRemoveUser = (userId: User['userId']) => {
    const filteredCoworkerInfos = coworkerInfos.filter((coworkerInfo) => coworkerInfo.userId !== userId);
    const filteredCoworkers = filteredCoworkerInfos.map(({ userId, roleName }) => ({
      userId,
      roleName,
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

    const updatedCoworkerInfos: TeamCoworker[] = [
      ...coworkerInfos,
      { userId: user.userId, nickname: user.nickname, roleName: TEAM_DEFAULT_ROLE },
    ];
    const updatedCoworkers = updatedCoworkerInfos.map(({ userId, roleName }) => ({
      userId,
      roleName,
    }));
    setCoworkerInfos(updatedCoworkerInfos);
    setValue('coworkers', updatedCoworkers);
    setKeyword('');
    clearData();
  };

  const handleSubmitForm: SubmitHandler<TeamForm> = (formData: TeamForm) => onSubmit(formData);

  if (isTeamListLoading) return <Spinner />;

  return (
    <FormProvider {...methods}>
      <form id={formId} className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
          <p className="text-sky-700">
            <strong>팀 권한 정보</strong>
          </p>
          <RoleTooltip showTooltip={showTooltip} rolesInfo={TEAM_ROLE_INFO} />
        </div>

        <DuplicationCheckInput
          id="teamName"
          label="팀명"
          value={watch('teamName')}
          placeholder="팀명을 입력해주세요."
          errors={errors.teamName?.message}
          register={register('teamName', TEAM_VALIDATION_RULES.TEAM_NAME(teamNameList))}
        />

        <DescriptionTextarea
          id="teamDescription"
          label="팀 설명"
          fieldName="content"
          placeholder="팀에 대한 설명을 입력해주세요."
          validationRole={TEAM_VALIDATION_RULES.TEAM_DESCRIPTION}
          errors={errors.content?.message}
        />

        <div className="mb-16">
          <SearchUserInput
            id="search"
            label="팀원"
            keyword={keyword}
            loading={loading}
            userList={userList}
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
                roles={TEAM_CREATE_ROLES}
                defaultValue={TEAM_DEFAULT_ROLE}
                onRoleChange={handleRoleChange}
                onRemoveUser={handleRemoveUser}
              />
            ))}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
