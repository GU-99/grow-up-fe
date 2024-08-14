import { NavLink } from 'react-router-dom';

type ListSettingProps = {
  navList: {
    label: string;
    route: string;
  }[];
};

export default function ListSetting({ navList }: ListSettingProps) {
  return (
    <ul>
      {navList.map((item) => (
        <li key={item.label} className="relative cursor-pointer border-b bg-white hover:brightness-90">
          <NavLink
            to={`/setting/${item.route}`}
            className={({ isActive }) =>
              `flex h-30 flex-col justify-center border-l-4 px-10 ${isActive ? 'border-l-main' : 'border-l-transparent'}`
            }
          >
            <span>{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
