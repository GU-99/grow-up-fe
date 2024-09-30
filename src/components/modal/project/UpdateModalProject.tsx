import ModalPortal from '@components/modal/ModalPortal';
import ModalLayout from '@layouts/ModalLayout';
import ModalButton from '@components/modal/ModalButton';
import ModalProjectForm from '@components/modal/project/ModalProjectForm';

import type { SubmitHandler } from 'react-hook-form';
import type { Project } from '@/types/ProjectType';

type UpdateModalProjectProps = {
  projectId: Project['projectId'];
  onClose: () => void;
};

export default function UpdateModalProject({ projectId, onClose: handleClose }: UpdateModalProjectProps) {
  const updateProjectFormId = 'updateProjectForm';

  const handleSubmit: SubmitHandler<Project> = async (data) => {
    console.log('프로젝트 생성 폼 제출');
    console.log(data);
    handleClose();
  };

  // ToDo: 프로젝트 수정 API 작업시 작성할 것
  const handleUpdateClick = () => {};

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalProjectForm formId={updateProjectFormId} projectId={projectId} onSubmit={handleSubmit} />
        <ModalButton formId={updateProjectFormId} backgroundColor="bg-main" onClick={handleUpdateClick}>
          수정
        </ModalButton>
      </ModalLayout>
    </ModalPortal>
  );
}
