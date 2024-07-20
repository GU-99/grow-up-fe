import { Link, useParams } from 'react-router-dom';
import type { Project } from '@/types/ProjectType';

type ListProjectProps = {
  data: Project[];
  targetId?: string;
};

export default function ListProject({ data, targetId }: ListProjectProps) {
  const { teamId } = useParams();

  return (
    <ul className="grow overflow-auto">
      {data.map((item) => (
        <li
          key={item.projectId}
          className={`relative cursor-pointer border-b bg-white hover:brightness-90 ${targetId === item.projectId.toString() ? 'selected' : ''}`}
        >
          <Link
            to={`/teams/${teamId}/projects/${item.projectId}/calendar`}
            className="flex h-30 flex-col justify-center px-10"
          >
            <small className="font-bold text-category">project</small>
            <span>{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
