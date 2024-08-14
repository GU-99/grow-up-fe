import ModalPortal from '@components/modal/ModalPortal';
import ModalLayout from '@layouts/ModalLayout';
import ModalProjectForm from '@components/modal/project/ModalProjectForm';
import ModalFormButton from '@components/modal/ModalFormButton';

import type { SubmitHandler } from 'react-hook-form';
import type { Project } from '@/types/ProjectType';

type CreateModalProjectProps = {
  onClose: () => void;
};

export default function CreateModalProject({ onClose: handleClose }: CreateModalProjectProps) {
  const handleSubmit: SubmitHandler<Project> = async (data) => {
    console.log('프로젝트 생성 폼 제출');
    console.log(data);
    handleClose();
  };
  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalProjectForm formId="createProjectForm" onSubmit={handleSubmit} />
        <ModalFormButton formId="createProjectForm" isCreate onClose={handleClose} />
      </ModalLayout>
    </ModalPortal>
  );
}
