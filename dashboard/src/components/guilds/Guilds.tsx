import { Outlet } from "react-router-dom";
import { GuildList } from "./GuildList/GuildList";
import { useGuildsQuery } from "../../apollo/generated";
import { useEffect } from "react";

export function Guilds() {
  const { data, loading, startPolling, stopPolling } = useGuildsQuery();

  useEffect(() => {
    startPolling(3000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const guilds =
    data?.guilds.map((guild) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon ?? undefined,
      isPlaying: guild.playbackStatus != null,
    })) ?? [];

  return (
    <div className="h-full flex">
      <div className="w-28 lg:w-48 xl:w-72 bg-gray-1">{!loading && <GuildList guilds={guilds} />}</div>
      <div className="flex-1 relative bg-gray-1">
        <div className="absolute inset-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
