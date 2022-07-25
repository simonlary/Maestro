import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useUserQuery } from "../apollo/generated";
import { config } from "../config";
import { Button } from "./controls/Button";
import headerIcon from "./header-icon.svg";

export function AppBar() {
  const { data } = useUserQuery();
  const navigate = useNavigate();
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 h-full hover:bg-gray-2 font-bold ${isActive ? "text-white" : "text-soft-white"}`;

  function logout() {
    config.clearAccessToken();
    navigate("/login");
  }

  return (
    <div className="flex flex-col h-full">
      <nav className="flex items-center h-12 bg-gray-1 text-white">
        <img className="h-full p-1" src={headerIcon} />
        <h1 className="font-bold text-white -ml-2 mr-4 select-none">aestro</h1>
        <div className="flex-1 h-full">
          {data?.user.isAdmin && (
            <div className="flex items-center h-full">
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
          )}
        </div>
        <Button text="Logout" className="m-1" onClick={logout} />
      </nav>
      <div className="flex-1 relative overflow-auto h-full bg-gray-2">
        <Outlet />
      </div>
    </div>
  );
}
