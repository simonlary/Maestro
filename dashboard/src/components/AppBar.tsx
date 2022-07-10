import { NavLink } from "react-router-dom";
import headerIcon from "./header-icon.svg";

export function AppBar() {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 h-full hover:bg-gray-2 font-bold ${isActive ? "text-white" : "text-soft-white"}`;

  return (
    <nav className="flex items-center h-10 bg-gray-1 text-white">
      <img className="h-full p-1" src={headerIcon} />
      <h1 className="font-bold text-white -ml-2 mr-4 select-none">aestro</h1>
      <div className="flex items-center h-10">
        <NavLink to="/guilds" className={getNavClass}>
          Guilds
        </NavLink>
        <NavLink to="/logs" className={getNavClass}>
          Logs
        </NavLink>
        <NavLink to="/settings" className={getNavClass}>
          Settings
        </NavLink>
      </div>
    </nav>
  );
}
