import { useForm } from 'react-hook-form';

import type { SubmitHandler } from 'react-hook-form';
import type { Project } from '@/types/ProjectType';

type ModalProjectFormProps = {
  formId: string;
  projectId?: Project['projectId'];
  onSubmit: SubmitHandler<Project>;
};

export default function ModalProjectForm({ formId, projectId, onSubmit }: ModalProjectFormProps) {
  const { handleSubmit } = useForm<Project>();
  return (
    <form id={formId} className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
      project form
    </form>
  );
}
