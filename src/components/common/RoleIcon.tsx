import { TbChess, TbChessKnight, TbChessQueen } from 'react-icons/tb';
import { Role } from '@/types/RoleType';

type RoleIconProps = {
  roleName: Role['roleName'];
};

function getRoleIcon(roleName: Role['roleName']) {
  switch (roleName) {
    case 'HEAD':
    case 'ADMIN':
      return <TbChessQueen />;
    case 'LEADER':
      return <TbChessKnight />;
    case 'MATE':
    case 'ASSIGNEE':
      return <TbChess />;
    default:
      return null;
  }
}

export default function RoleIcon({ roleName }: RoleIconProps) {
  return (
    <div className="group relative cursor-help">
      {getRoleIcon(roleName)}
      {/* prettier-ignore */}
      <h4 className="
        invisible absolute bottom-full left-1/2 -translate-x-1/2 select-none rounded-md bg-black/50 px-5 
        my-2 text-center text-xs text-white transition-opacity duration-700 group-hover:visible
        after:content[''] after:absolute after:top-full after:left-1/2 after:border-4 after:-ml-2
      after:border-t-black/50 after:border-b-transparent after:border-x-transparent
      ">
        {roleName}
      </h4>
    </div>
  );
}
