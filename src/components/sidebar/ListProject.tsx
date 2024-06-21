import { Link, useParams } from 'react-router-dom';
import type { ProjectType } from '@/types/project';

type ListProjectProps = {
  data: ProjectType[];
  targetId?: string;
};

export default function ListProject({ data, targetId }: ListProjectProps) {
  const { teamId } = useParams();

  return (
    <ul className="grow overflow-auto">
      {data.map((item) => (
        <li
          key={item.id}
          className={`relative cursor-pointer border-b bg-white hover:brightness-90 ${targetId === item.id && 'selected'}`}
        >
          <Link
            to={`/teams/${teamId}/projects/${item.id}/calendar`}
            className="flex h-30 flex-col justify-center px-10"
          >
            <small className="font-bold text-category">project</small>
            <span>{item.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
