import { useOutletContext } from 'react-router-dom';
import { Project } from '@/types/ProjectType';
import { UserWithRole } from '@/types/UserType';

export type ProjectContext = { project: Project; projectCoworkers: UserWithRole[] };

export default function useProjectContext() {
  return useOutletContext<ProjectContext>();
}
