import { NavLink } from "react-router-dom";

export function AppBar() {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 h-full hover:bg-gray-2 font-bold ${isActive ? " border-b " : "text-soft-white"}`;

  return (
    <nav className="bg-gray-1 text-white">
      <div className="mx-auto px-8">
        <div className="relative flex items-center h-10">
          <h1 className="font-bold text-gray-text pr-4 select-none">Maestro</h1>
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
      </div>
    </nav>
  );
}
