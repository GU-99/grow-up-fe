import ModalPortal from '@components/modal/ModalPortal';
import ModalLayout from '@layouts/ModalLayout';
import ModalButton from '@components/modal/ModalButton';
import ModalProjectForm from '@components/modal/project/ModalProjectForm';

import type { SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useCreateProject } from '@hooks/query/useProjectQuery';
import type { ProjectForm } from '@/types/ProjectType';

type CreateModalProjectProps = {
  onClose: () => void;
};

export default function CreateModalProject({ onClose: handleClose }: CreateModalProjectProps) {
  const createProjectFormId = 'createProjectForm';
  const { teamId } = useParams();

  const numberTeamId = Number(teamId);
  const { mutate: createProjectMutate } = useCreateProject(numberTeamId);

  const handleSubmit: SubmitHandler<ProjectForm> = async (data) => {
    createProjectMutate(data);
    handleClose();
  };
  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalProjectForm formId={createProjectFormId} onSubmit={handleSubmit} />
        <ModalButton formId={createProjectFormId} color="text-white" backgroundColor="bg-main">
          등록
        </ModalButton>
      </ModalLayout>
    </ModalPortal>
  );
}
