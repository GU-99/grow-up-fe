import { ProjectRoles, RolePriority, TeamRoles } from '@/types/RoleType';

export default function hasPermission<T extends TeamRoles | ProjectRoles>(
  rolePriorityMap: RolePriority<T>,
  requiredRole: keyof RolePriority<T>,
  userRole: keyof RolePriority<T>,
): boolean {
  return rolePriorityMap[userRole] >= rolePriorityMap[requiredRole];
}
