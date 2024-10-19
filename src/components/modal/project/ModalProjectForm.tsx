import { FormProvider, useForm } from 'react-hook-form';

import type { SubmitHandler } from 'react-hook-form';
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
import { findUser } from '@services/userService';
import { AllSearchCallback } from '@/types/SearchCallbackType';
import type { ProjectRoleName } from '@/types/RoleType';
import type { Project, ProjectCoworkerInfo, ProjectForm } from '@/types/ProjectType';
import type { SearchUser } from '@/types/UserType';

type ModalProjectFormProps = {
  formId: string;
  projectId?: Project['projectId'];
  onSubmit: SubmitHandler<ProjectForm>;
};

export default function ModalProjectForm({ formId, projectId, onSubmit }: ModalProjectFormProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [coworkerInfos, setCoworkerInfos] = useState<ProjectCoworkerInfo[]>([]);
  // TODO: 프로젝트 생성 팀 사용자 찾기로 바꾸기
  const { loading, data: userList = [], fetchData } = useAxios(findUser);

  // TODO: 프로젝트 생성 팀 사용자 찾기로 바꾸기
  const searchCallbackInfo: AllSearchCallback = useMemo(
    () => ({ type: 'ALL', searchCallback: fetchData }),
    [fetchData],
  );

  const methods = useForm<ProjectForm>({
    mode: 'onChange',
    defaultValues: {
      projectName: '',
      content: '',
      startDate: new Date(),
      endDate: null,
      coworkers: [],
    },
  });

  const {
    watch,
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const startDate = watch('startDate') || new Date();
  const endDate = watch('endDate') || null;

  const handleCoworkersClick = (user: SearchUser) => {
    console.log(user);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value.trim());
  };

  const handleRoleChange = (userId: number, roleName: ProjectRoleName) => {
    console.log(userId, roleName);
  };

  const handleRemoveUser = (userId: number) => {
    console.log(userId);
  };

  return (
    <FormProvider {...methods}>
      <form id={formId} className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="mb-30">
          <DescriptionTextarea
            id="content"
            label="프로젝트 설명"
            fieldName="content"
            placeholder="프로젝트 내용을 입력해주세요."
            validationRole={PROJECT_VALIDATION_RULES.PROJECT_DESCRIPTION}
            errors={errors.content?.message}
          />
        </div>
        <PeriodDateInput
          startDateLabel="시작일"
          endDateLabel="종료일"
          startDateId="startDate"
          endDateId="endDate"
          startDateFieldName="startDate"
          endDateFieldName="endDate"
          limitStartDate={startDate}
          limitEndDate={endDate}
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
                roles={PROJECT_ROLES}
                defaultValue="MATE"
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
