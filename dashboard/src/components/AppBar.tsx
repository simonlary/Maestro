import { NavLink } from "react-router-dom";
import { useUserQuery } from "../apollo/generated";
import { Button } from "./controls/Button";
import headerIcon from "./header-icon.svg";

const CLIENT_ID = "283320553136193539";

export function AppBar() {
  const { data } = useUserQuery();

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 h-full hover:bg-gray-2 font-bold ${isActive ? "text-white" : "text-soft-white"}`;

  function login() {
    const redirectUrl = encodeURIComponent(`${window.location.origin}/login`);
    window.location.assign(
      `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&scope=identify%20guilds&redirect_uri=${redirectUrl}`
    );
  }

  return (
    <nav className="flex items-center h-12 bg-gray-1 text-white">
      <img className="h-full p-1" src={headerIcon} />
      <h1 className="font-bold text-white -ml-2 mr-4 select-none">aestro</h1>
      <div className="flex-1 h-full">
        <div className="flex items-center h-full">
          <NavLink to="/guilds" className={getNavClass}>
            Guilds
          </NavLink>
          {data?.user.isAdmin && (
            <NavLink to="/logs" className={getNavClass}>
              Logs
            </NavLink>
          )}
          {data?.user.isAdmin && (
            <NavLink to="/settings" className={getNavClass}>
              Settings
            </NavLink>
          )}
        </div>
      </div>
      <Button text="Login with Discord" className="m-1" onClick={login} />
    </nav>
  );
}
