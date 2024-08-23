import { useForm } from 'react-hook-form';

import type { SubmitHandler } from 'react-hook-form';
import type { Team } from '@/types/TeamType';

type ModalTeamFormProps = {
  formId: string;
  teamId: Team['teamId'];
  onSubmit: SubmitHandler<Team>;
};

export default function ModalTeamForm({ formId, teamId, onSubmit }: ModalTeamFormProps) {
  const { handleSubmit } = useForm<Team>();

  return (
    <form id={formId} className="mb-10 flex grow flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
      123123123
    </form>
  );
}
