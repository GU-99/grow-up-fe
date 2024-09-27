import { FormProvider, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import DescriptionITextarea from '@components/common/DescriptionITextarea';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import SearchUserInput from '@components/common/SearchUserInput';
import useAxios from '@hooks/useAxios';
import { findUser } from '@services/userService';
import useToast from '@hooks/useToast';
import SelectedUserWithRole from '@components/common/SelectedUserWithRole';
import RoleTooltip from '@components/common/RoleTooltip';
import { TEAM_VALIDATION_RULES } from '@constants/formValidationRules';
import type { SearchUser } from '@/types/UserType';
import type { Team, TeamForm } from '@/types/TeamType';
import type { AllSearchCallback } from '@/types/SearchCallbackType';
import type { RoleInfo, TeamRoleName } from '@/types/RoleType';
import { TEAM_ROLES } from '@/constants/role';

type ModalTeamFormProps = {
  formId: string;
  teamId?: Team['teamId'];
  onSubmit: SubmitHandler<TeamForm>;
};

export default function ModalTeamForm({ formId, teamId, onSubmit }: ModalTeamFormProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<{ user: SearchUser; role: TeamRoleName }[]>([]);
  const [keyword, setKeyword] = useState('');
  const { loading, data: userList = [], clearData, fetchData } = useAxios(findUser);
  const { toastInfo } = useToast();

  const rolesInfo: RoleInfo[] = useMemo(
    () => [
      { roleName: 'HEAD', label: 'HEAD', description: '모든 권한 가능' },
      {
        roleName: 'LEADER',
        label: 'Leader',
        description: '팀원 탈퇴(Mate만)\n프로젝트 생성 권한\n프로젝트 삭제(본인이 생성한 것만)',
      },
      { roleName: 'MATE', label: 'Mate', description: '프로젝트 읽기만 가능, 수정 및 생성 불가' },
    ],
    [],
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
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleRoleChange = (userId: number, role: TeamRoleName) => {
    setSelectedUsers((prev) => {
      const updated = prev.map((item) => (item.user.userId === userId ? { ...item, role } : item));
      setValue(
        'coworkers',
        updated.map(({ user, role }) => ({ userId: user.userId, roleName: role })),
      );
      return updated;
    });
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers((prev) => {
      const updated = prev.filter((item) => item.user.userId !== userId);
      setValue(
        'coworkers',
        updated.map(({ user, role }) => ({ userId: user.userId, roleName: role })),
      );
      return updated;
    });
  };

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
    setValue(
      'coworkers',
      updatedUsers.map(({ user, role }) => ({ userId: user.userId, roleName: role })),
    );
    setKeyword('');
    clearData();
  };

  const handleSubmitForm: SubmitHandler<TeamForm> = (data) => {
    const { teamName, content } = data;
    const payload = { teamName, content, coworkers: data.coworkers };
    onSubmit(payload);
  };

  return (
    <FormProvider {...methods}>
      <form id={formId} className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
          <p className="text-sky-700">
            <strong>팀 권한 정보</strong>
          </p>
          <RoleTooltip showTooltip={showTooltip} rolesInfo={rolesInfo} />
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
            {selectedUsers.map(({ user }) => (
              <SelectedUserWithRole
                key={user.userId}
                user={user}
                roles={TEAM_ROLES}
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
