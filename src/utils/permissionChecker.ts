import type { RolePriority, Roles } from '@/types/RoleType';

export default function hasPermission<T extends Roles>(
  rolePriorityMap: RolePriority<T>,
  requiredRole: keyof RolePriority<T>,
  userRole: keyof RolePriority<T>,
): boolean {
  return rolePriorityMap[userRole] >= rolePriorityMap[requiredRole];
}
