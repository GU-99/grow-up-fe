import { useEffect, useMemo, useState } from 'react';
import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  useAddTeamCoworker,
  useDeleteTeamCoworker,
  useReadTeamCoworkers,
  useReadTeamInfo,
  useReadTeams,
  useUpdateTeamCoworkerRole,
  useUpdateTeamInfo,
} from '@hooks/query/useTeamQuery';
import { TEAM_VALIDATION_RULES } from '@constants/formValidationRules';
import { TEAM_DEFAULT_ROLE, TEAM_ROLES } from '@constants/role';
import Spinner from '@components/common/Spinner';
import ModalButton from '@components/modal/ModalButton';
import SearchUserInput from '@components/common/SearchUserInput';
import UserRoleSelectBox from '@components/common/UserRoleSelectBox';
import DescriptionTextarea from '@components/common/DescriptionTextarea';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import { getTeamNameList } from '@utils/extractNameList';
import { findUser } from '@services/userService';
import useAxios from '@hooks/useAxios';
import useToast from '@hooks/useToast';
import type { Team, TeamForm } from '@/types/TeamType';
import type { TeamRoleName } from '@/types/RoleType';
import type { AllSearchCallback } from '@/types/SearchCallbackType';
import type { User } from '@/types/UserType';

type UpdateModalTeamProps = {
  teamId: Team['teamId'];
  onClose: () => void;
};

export default function UpdateModalTeam({ teamId, onClose: handleClose }: UpdateModalTeamProps) {
  const updateTeamFormId = 'updateTeamForm';
  const [keyword, setKeyword] = useState('');
  const { toastInfo, toastWarn } = useToast();

  const { coworkers, isLoading: isTeamCoworkersLoading } = useReadTeamCoworkers(teamId);
  const { teamList, isLoading: isTeamListLoading } = useReadTeams();
  const { teamInfo } = useReadTeamInfo(Number(teamId));
  const teamNameList = useMemo(() => getTeamNameList(teamList, teamInfo?.teamName), [teamList, teamInfo?.teamName]);

  const { mutate: updateTeamMutate } = useUpdateTeamInfo();
  const { mutate: addTeamCoworkerMutate } = useAddTeamCoworker(teamId);
  const { mutate: deleteCoworkerMutate } = useDeleteTeamCoworker(teamId);
  const { mutate: updateTeamCoworkerRoleMutate } = useUpdateTeamCoworkerRole(teamId);

  const { loading: isUserLoading, data: userList = [], clearData, fetchData } = useAxios(findUser);

  const searchCallbackInfo: AllSearchCallback = useMemo(
    () => ({ type: 'ALL', searchCallback: fetchData }),
    [fetchData],
  );

  const methods = useForm<TeamForm>({ mode: 'onChange' });
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (teamInfo?.teamName && teamInfo?.content && coworkers) {
      reset({ teamName: teamInfo.teamName, content: teamInfo.content, coworkers });
    }
  }, [teamInfo, coworkers, reset]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value.trim());
  };

  const handleFormSubmit: SubmitHandler<TeamForm> = async (formData) => {
    updateTeamMutate({ teamId, teamInfo: formData });
    handleClose();
  };

  const handleCoworkersClick = (userId: User['userId'], roleName: TeamRoleName) => {
    const isIncludedUser = coworkers.find((coworker) => coworker.userId === userId);
    if (isIncludedUser) return toastInfo('이미 포함된 팀원입니다');

    addTeamCoworkerMutate({ userId, roleName });
    setKeyword('');
    clearData();
  };

  const handleRemoveUser = (userId: User['userId']) => {
    deleteCoworkerMutate(userId);
  };

  const handleRoleChange = (userId: User['userId'], roleName: TeamRoleName) => {
    updateTeamCoworkerRoleMutate({ userId, roleName });
  };

  if (isTeamCoworkersLoading || isTeamListLoading) {
    return <Spinner />;
  }

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <FormProvider {...methods}>
          <form id="updateTeamForm" onSubmit={handleSubmit(handleFormSubmit)}>
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
          </form>
        </FormProvider>

        <ModalButton formId={updateTeamFormId} color="text-white" backgroundColor="bg-main">
          수정
        </ModalButton>

        <div className="my-16">
          <SearchUserInput
            id="search"
            label="팀원"
            keyword={keyword}
            loading={isUserLoading}
            userList={userList}
            searchCallbackInfo={searchCallbackInfo}
            onKeywordChange={handleKeywordChange}
            onUserClick={(user) => handleCoworkersClick(user.userId, TEAM_DEFAULT_ROLE)}
          />
          <div className="flex flex-wrap">
            {coworkers.map(({ userId, nickname, roleName }) => (
              <UserRoleSelectBox
                key={userId}
                userId={userId}
                nickname={nickname}
                roles={TEAM_ROLES}
                defaultValue={roleName as TeamRoleName}
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
