import RoleIcon from '@components/common/RoleIcon';
import { RoleInfo } from '@/types/RoleType';

type RoleTooltipProps = {
  showTooltip: boolean;
  rolesInfo: RoleInfo[];
};

export default function RoleTooltip({ showTooltip, rolesInfo }: RoleTooltipProps) {
  return (
    <div
      className={`absolute left-0 top-full z-10 mt-2 w-max space-y-10 rounded-lg bg-gray-500 p-10 leading-5 text-white shadow-lg ${!showTooltip && 'hidden'}`}
    >
      {rolesInfo.map((role) => (
        <div key={role.roleName}>
          <div className="flex items-center">
            <RoleIcon roleName={role.roleName} />
            <strong>{role.label}</strong>
          </div>
          <pre>{role.description}</pre>
        </div>
      ))}
    </div>
  );
}
