import { NavLink } from "react-router-dom";

interface GuildInfo {
  id: string;
  name: string;
  icon?: string;
  isPlaying: boolean;
}

function GuildEntry({ guild }: { guild: GuildInfo }) {
  const icon = guild.icon ?? "https://cdn.discordapp.com/embed/avatars/0.png";
  return (
    <NavLink
      to={guild.id}
      className={({ isActive }) =>
        `flex items-center justify-center lg:justify-start rounded-sm h-16 p-2 ${
          isActive ? "bg-selected" : "hover:bg-hover"
        }`
      }
    >
      <div className="rounded-full h-full overflow-hidden">
        <img src={icon} alt="Guild icon" className="h-full object-cover" />
      </div>
      <div className="flex-1 font-semibold truncate pl-2 hidden lg:block">{guild.name}</div>
    </NavLink>
  );
}

export function GuildList({ guilds }: { guilds: GuildInfo[] }) {
  const sortedGuilds = guilds.sort((a, b) => a.name.localeCompare(b.name));
  const playingGuilds = sortedGuilds.filter((guild) => guild.isPlaying);
  const notPlayingGuilds = sortedGuilds.filter((guild) => !guild.isPlaying);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col pt-4 px-1 flex-1 overflow-auto gap-1">
        {playingGuilds.length > 0 && playingGuilds.map((guild) => <GuildEntry key={guild.id} guild={guild} />)}
        {playingGuilds.length > 0 && <hr className="border-t-soft-white" />}
        {notPlayingGuilds.map((guild) => (
          <GuildEntry key={guild.id} guild={guild} />
        ))}
      </div>
    </div>
  );
}
