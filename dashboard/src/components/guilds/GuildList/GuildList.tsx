import { GuildEntry } from "./GuildEntry";
import { GuildInfo } from "./GuildInfo";

export function GuildList({ guilds }: { guilds: GuildInfo[] }) {
  const sortedGuilds = guilds.sort((a, b) => a.name.localeCompare(b.name));
  const playingGuilds = sortedGuilds.filter((guild) => guild.isPlaying);
  const notPlayingGuilds = sortedGuilds.filter((guild) => !guild.isPlaying);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col py-4 px-1 flex-1 overflow-auto hide-scrollbar gap-1">
        {playingGuilds.length > 0 && playingGuilds.map((guild) => <GuildEntry key={guild.id} guild={guild} />)}
        {playingGuilds.length > 0 && <hr className="border-t-soft-white" />}
        {notPlayingGuilds.map((guild) => (
          <GuildEntry key={guild.id} guild={guild} />
        ))}
      </div>
    </div>
  );
}
