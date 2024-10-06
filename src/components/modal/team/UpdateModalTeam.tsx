import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  useAddTeamCoworker,
  useDeleteCoworker,
  useReadTeamInfo,
  useUpdateRole,
  useUpdateTeamInfo,
} from '@hooks/query/useTeamQuery';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import { useEffect, useMemo, useState } from 'react';
import ModalButton from '@components/modal/ModalButton';
import { TEAM_VALIDATION_RULES } from '@constants/formValidationRules';
import Spinner from '@components/common/Spinner';
import DescriptionTextarea from '@components/common/DescriptionTextarea';
import SearchUserInput from '@components/common/SearchUserInput';
import UserRoleSelectBox from '@components/common/UserRoleSelectBox';
import { TEAM_ROLES } from '@constants/role';
import { findUser } from '@services/userService';
import useAxios from '@hooks/useAxios';
import useToast from '@hooks/useToast';
import type { Team, TeamForm } from '@/types/TeamType';
import type { TeamRoleName } from '@/types/RoleType';
import type { AllSearchCallback } from '@/types/SearchCallbackType';

type UpdateModalTeamProps = {
  teamId: Team['teamId'];
  onClose: () => void;
};

export default function UpdateModalTeam({ teamId, onClose: handleClose }: UpdateModalTeamProps) {
  const updateTeamFormId = 'updateTeamForm';
  const [keyword, setKeyword] = useState('');
  const { toastInfo, toastWarn } = useToast();
  const { loading, data: userList = [], clearData, fetchData } = useAxios(findUser);

  const { teamName, content, coworkers, isLoading, isError, error } = useReadTeamInfo(teamId);

  const { mutate: updateTeamMutation } = useUpdateTeamInfo();

  const { mutate: AddTeamCoworkerMutation } = useAddTeamCoworker(teamId);
  const { mutate: deleteCoworkerMutation } = useDeleteCoworker(teamId);
  const { mutate: updateRoleMutation } = useUpdateRole(teamId);

  const methods = useForm<TeamForm>({ mode: 'onChange' });
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (teamName && content) {
      reset({ teamName, content, coworkers });
    }
  }, [teamName, content, coworkers, reset]);

  const handleFormSubmit: SubmitHandler<TeamForm> = async (formData) => {
    updateTeamMutation({ teamId, teamData: formData });
    handleClose();
  };

  const searchCallbackInfo: AllSearchCallback = useMemo(
    () => ({ type: 'ALL', searchCallback: fetchData }),
    [fetchData],
  );

  const handleCoworkersClick = (userId: number, roleName: TeamRoleName) => {
    const isIncludedUser = coworkers.find((coworker) => coworker.userId === userId);
    if (isIncludedUser) return toastInfo('이미 포함된 팀원입니다');

    const validRole = TEAM_ROLES.includes(roleName);
    if (!validRole) {
      return toastWarn('유효하지 않은 역할입니다.');
    }

    AddTeamCoworkerMutation({ userId, roleName });
    setKeyword('');
    clearData();
  };

  const handleRemoveUser = (userId: number) => {
    deleteCoworkerMutation(userId);
  };

  // 권한 변경 핸들러
  const handleRoleChange = (userId: number, roleName: TeamRoleName) => {
    updateRoleMutation({ userId, roleName });
  };

  if (isLoading || loading) {
    return <Spinner />;
  }

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <FormProvider {...methods}>
          <form id="updateTeamForm" onSubmit={handleSubmit(handleFormSubmit)}>
            {/* 팀명 불러오기 */}
            <DuplicationCheckInput
              id="teamName"
              label="팀명"
              value={watch('teamName')}
              placeholder="팀명을 입력해주세요."
              errors={errors.teamName?.message}
              register={register('teamName', TEAM_VALIDATION_RULES.TEAM_NAME)}
            />
            {/* 팀 설명 불러오기 */}
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
        {/* 팀명 및 팀 설명 수정 제출 */}
        <ModalButton formId={updateTeamFormId} backgroundColor="bg-main">
          수정
        </ModalButton>

        {/* 팀원 추가 , 팀원 삭제 , 권한 설정 즉시반영  */}
        <div className="my-16">
          <SearchUserInput
            id="search"
            label="팀원"
            keyword={keyword}
            loading={isLoading}
            userList={userList}
            searchCallbackInfo={searchCallbackInfo}
            onKeywordChange={(event) => setKeyword(event.target.value)}
            onUserClick={(user) => handleCoworkersClick(user.userId, 'MATE')}
          />
          <div className="flex flex-wrap">
            {coworkers.map(({ userId, nickname, roleName }) => (
              <UserRoleSelectBox
                key={userId}
                userId={userId}
                nickname={nickname || '이름 없음'}
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
