import ProjectItem from '@components/project/ProjectItem';
import type { Team } from '@/types/TeamType';
import type { Project } from '@/types/ProjectType';

type ProjectItemListProps = {
  teamId: Team['teamId'];
  projectList: Project[];
};

export default function ProjectItemList({ teamId, projectList }: ProjectItemListProps) {
  return (
    <ul>
      {projectList.map((project) => (
        <ProjectItem key={project.projectId} teamId={teamId} project={project} />
      ))}
    </ul>
  );
}
