import { useOutletContext } from 'react-router-dom';
import { Project, ProjectCoworker } from '@/types/ProjectType';

export type ProjectContext = { project: Project; projectCoworkers: ProjectCoworker[] };

export default function useProjectContext() {
  return useOutletContext<ProjectContext>();
}
