import { Outlet } from "react-router-dom";
import { GuildList } from "./GuildList";
import { useGuildsQuery } from "../../apollo/generated";

export function Guilds() {
  const { data, loading } = useGuildsQuery();

  return (
    <div className="h-full flex">
      <div className="w-28 lg:w-48 xl:w-72 bg-gray-1">{!loading && <GuildList guilds={data?.guilds ?? []} />}</div>
      <div className="flex-1 relative bg-gray-1">
        <div className="absolute inset-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
