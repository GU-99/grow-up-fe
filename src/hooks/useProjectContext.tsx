import { useOutletContext } from 'react-router-dom';
import { Project } from '@/types/ProjectType';

export type ProjectContext = { project: Project };

export default function useProjectContext() {
  return useOutletContext<ProjectContext>();
}
