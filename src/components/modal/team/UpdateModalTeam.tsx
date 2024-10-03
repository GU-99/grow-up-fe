import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalButton from '@components/modal/ModalButton';
import ModalTeamForm from '@components/modal/team/ModalTeamForm';
import ModaFormButton from '@components/modal/ModalFormButton';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Team, TeamForm } from '@/types/TeamType';
import DuplicationCheckInput from '@/components/common/DuplicationCheckInput';
import DescriptionITextarea from '@/components/common/DescriptionITextarea';
import { useReadTeamInfo } from '@/hooks/query/useTeamQuery';

type UpdateModalTeamProps = {
  teamId: Team['teamId'];
  onClose: () => void;
};
export default function UpdateModalTeam({ teamId, onClose: handleClose }: UpdateModalTeamProps) {
  const updateTeamFormId = 'updateTeamForm';
  const handleSubmit: SubmitHandler<TeamForm> = async (data) => {
    console.log(teamId, '수정 폼 제출');
    console.log(data);
    handleClose();
  };

  // ToDo: 팀 수정 API 작업시 같이 작업할 것.
  const handleUpdateClick = () => {};

  const methods = useForm<TeamForm>({ mode: 'onChange' });

  const { team, coworkers, isTeamLoading, isCoworkersLoading } = useReadTeamInfo(teamId);

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <FormProvider {...methods}>
          <form id="updateTeamForm">
            {/* 팀명 불러오기 */}

            {/* 팀 설명 불러오기 */}
          </form>
        </FormProvider>
        {/* 팀명 및 팀 설명 수정 제출 */}

        {/* 팀원 추가 , 팀원 삭제 , 권한 설정 즉시반영  */}
      </ModalLayout>
    </ModalPortal>
  );
}
