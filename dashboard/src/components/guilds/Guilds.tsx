import { Outlet } from "react-router-dom";
import { GuildList } from "./GuildList";

export function Guilds() {
  return (
    <div className="h-full flex">
      <div className="w-72 bg-gray-2">
        <GuildList />
      </div>
      <div className="flex-1 bg-gray-3">
        <Outlet />
      </div>
    </div>
  );
}
