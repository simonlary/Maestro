import { NavLink } from "react-router-dom";
import { Button } from "../controls/Button";

interface GuildInfo {
  id: string;
  name: string;
  icon: string;
}

function GuildEntry({ guild }: { guild: GuildInfo }) {
  return (
    <NavLink to={guild.id} className={({ isActive }) => `flex items-center justify-center md:justify-start rounded-sm h-16 p-2 ${isActive ? "bg-selected" : "hover:bg-hover"}`}>
      <div className="rounded-full h-full overflow-hidden">
        <img src={guild.icon} alt="Guild icon" className="h-full object-cover" />
      </div>
      <div className="flex-1 font-semibold truncate pl-2 hidden md:block">{guild.name}</div>
    </NavLink>
  );
}

export function GuildList({ guilds }: { guilds: GuildInfo[] }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col pt-4 px-2 flex-1 overflow-auto gap-1">
        {guilds.map((guild) => (
          <GuildEntry key={guild.id} guild={guild} />
        ))}
      </div>
      <div className="p-4 text-center bg-gray-1">
        <Button text="Add" size="md" variant="normal" className="w-20 md:w-36" />
      </div>
    </div>
  );
}
