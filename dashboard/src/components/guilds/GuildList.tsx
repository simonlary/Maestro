import { NavLink } from "react-router-dom";

function GuildEntry({ name, guildId }: { name: string, guildId: string }) {
  return (
    <NavLink to={guildId} className={({ isActive }) => `font-semibold rounded-sm p-2 ${isActive ? "bg-selected" : "hover:bg-hover"}`}>
      <div>{name}</div>
    </NavLink>
  );
}

export function GuildList() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col p-4 flex-1 overflow-auto">
        <GuildEntry name="Guild 1" guildId="1" />
        <GuildEntry name="Guild 2" guildId="2" />
        <GuildEntry name="Guild 3" guildId="3" />
        <GuildEntry name="Guild 4" guildId="4" />
        <GuildEntry name="Guild 5" guildId="5" />
      </div>
      <div className="p-4 text-center">
        <button className="bg-gray-3 hover:bg-gray-4 p-2 rounded">Add Guild</button>
      </div>
    </div>
  );
}
