import { useState } from "react";
import { NavLink } from "react-router-dom";
import { GuildIcon } from "./GuildIcon";
import { GuildInfo } from "./GuildInfo";

export function GuildEntry({ guild }: { guild: GuildInfo }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <NavLink
      to={guild.id}
      className={({ isActive }) =>
        `flex items-center justify-center lg:justify-start rounded-sm p-2 ${
          isActive ? "bg-selected" : "hover:bg-hover"
        }`
      }
      title={guild.name}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="rounded-full h-full overflow-hidden">
        <GuildIcon guild={guild} useAnimatedIcon={isHovering} />
      </div>
      <div className="flex-1 font-semibold truncate pl-2 hidden lg:block">{guild.name}</div>
    </NavLink>
  );
}
