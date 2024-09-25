import { FormProvider, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import DescriptionITextarea from '@components/common/DescriptionITextarea';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import SearchUserInput from '@components/common/SearchUserInput';
import useAxios from '@hooks/useAxios';
import { findUser } from '@services/userService';
import type { SearchUser } from '@/types/UserType';
import type { Team, TeamForm } from '@/types/TeamType';
import { AllSearchCallback } from '@/types/SearchCallbackType';
import useToast from '@/hooks/useToast';
import SelectedUserWithRole from '@/components/common/SelectedUserWithRole';
import RoleIcon from '@/components/common/RoleIcon';
import { TEAM_VALIDATION_RULES } from '@/constants/formValidationRules';

type ModalTeamFormProps = {
  formId: string;
  teamId?: Team['teamId'];
  onSubmit: SubmitHandler<TeamForm>;
};

export default function ModalTeamForm({ formId, teamId, onSubmit }: ModalTeamFormProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<{ user: SearchUser; role: 'HEAD' | 'LEADER' | 'MATE' }[]>([]);
  const [keyword, setKeyword] = useState('');
  const { loading, data: userList = [], clearData, fetchData } = useAxios(findUser);
  const { toastInfo } = useToast();

  const teamRoles = useMemo(
    () => [
      { value: 'HEAD' as const, label: 'HEAD' },
      { value: 'LEADER' as const, label: 'Leader' },
      { value: 'MATE' as const, label: 'Mate' },
    ],
    [],
  );

  const handleRoleChange = (userId: number, role: 'HEAD' | 'LEADER' | 'MATE') => {
    setSelectedUsers((prev) => prev.map((item) => (item.user.userId === userId ? { ...item, role } : item)));
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((item) => item.user.userId !== userId));
  };

  const methods = useForm<TeamForm>({
    mode: 'onChange',
    defaultValues: {
      teamName: '',
      content: '',
      coworkers: [],
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value.trim());
  };

  const searchCallbackInfo: AllSearchCallback = useMemo(
    () => ({ type: 'ALL', searchCallback: fetchData }),
    [fetchData],
  );

  const handleCoworkersClick = (user: SearchUser) => {
    const isIncludedUser = selectedUsers.find((selectedUser) => selectedUser.user.userId === user.userId);
    if (isIncludedUser) return toastInfo('이미 포함된 팀원입니다');

    const updatedUsers = [...selectedUsers, { user, role: 'MATE' as const }];
    setSelectedUsers(updatedUsers);
    setKeyword('');
    clearData();
  };

  const handleSubmitForm: SubmitHandler<TeamForm> = (data) => {
    const { teamName, content } = data;

    // coworkers 배열 생성
    const coworkers = selectedUsers.map(({ user, role }) => ({
      userId: user.userId,
      roleName: role,
    }));

    // 최종 데이터 구조
    const payload = {
      teamName,
      content,
      coworkers,
    };

    onSubmit(payload);
  };

  return (
    <FormProvider {...methods}>
      <form id={formId} className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(handleSubmitForm)}>
        {/* TODO: component 분리 하기 */}
        <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
          <p className="text-sky-700">
            <strong>팀 권한 정보</strong>
          </p>
          {showTooltip && (
            <div className="absolute left-0 top-full z-10 mt-2 w-max rounded-lg bg-gray-500 p-10 text-white shadow-lg">
              <div className="flex items-center">
                <RoleIcon roleName="HEAD" />
                <strong>HEAD</strong>{' '}
              </div>
              <p>모든 권한 가능</p>
              <div className="flex items-center">
                <RoleIcon roleName="LEADER" />
                <strong>Leader</strong> <br />
              </div>
              <p>
                팀원 탈퇴(Mate만)
                <br /> 프로젝트 생성 권한
                <br /> 프로젝트 삭제(본인이 생성한 것만)
              </p>
              <div className="flex items-center">
                <RoleIcon roleName="MATE" />
                <strong>Mate</strong>
              </div>
              <p>프로젝트 읽기만 가능, 수정 및 생성 불가</p>
            </div>
          )}
        </div>

        <DuplicationCheckInput
          id="teamName"
          label="팀명"
          value={methods.watch('teamName') || ''}
          placeholder="팀명을 입력해주세요."
          errors={errors.teamName?.message}
          register={methods.register('teamName', TEAM_VALIDATION_RULES.TEAM_NAME)}
        />

        <DescriptionITextarea
          id="teamDescription"
          label="팀 설명"
          placeholder="팀에 대한 설명을 입력해주세요."
          errors={errors.content?.message}
          register={methods.register('content', TEAM_VALIDATION_RULES.TEAM_DESCRIPTION)}
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
            {selectedUsers.map(({ user, role }) => (
              <SelectedUserWithRole
                key={user.userId}
                user={user}
                roles={teamRoles}
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
