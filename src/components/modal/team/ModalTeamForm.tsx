import { SubmitHandler, useForm } from 'react-hook-form';
import { Team } from '@/types/TeamType';

type ModalTeamFormProps = {
  formId: string;
  onSubmit: SubmitHandler<Team>;
};

export default function ModalTeamForm({ formId, onSubmit }: ModalTeamFormProps) {
  const { handleSubmit } = useForm<Team>();

  return (
    <form id={formId} className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
      123123123
    </form>
  );
}