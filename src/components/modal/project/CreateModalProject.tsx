import ModalPortal from '@components/modal/ModalPortal';
import ModalLayout from '@layouts/ModalLayout';
import ModalButton from '@components/modal/ModalButton';
import ModalProjectForm from '@components/modal/project/ModalProjectForm';

import type { SubmitHandler } from 'react-hook-form';
import type { Project } from '@/types/ProjectType';

type CreateModalProjectProps = {
  onClose: () => void;
};

export default function CreateModalProject({ onClose: handleClose }: CreateModalProjectProps) {
  const createProjectFormId = 'createProjectForm';

  const handleSubmit: SubmitHandler<Project> = async (data) => {
    console.log('프로젝트 생성 폼 제출');
    console.log(data);
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
