import { useMemo } from "react";
import { GuildInfo } from "./GuildInfo";

function GuildIconImage({ url }: { url: string }) {
  return <img src={url} alt="Guild icon" className="h-12 object-cover" />;
}

function calculateDefaultIconAcronym(name: string) {
  let result = "";
  let isInWord = false;
  let lastChar = "";
  for (const char of name) {
    const isWord = char.match(/\w/);
    if (isWord) {
      if (!isInWord) {
        result += char;
        isInWord = true;
      }
      if (lastChar + char === "'s") {
        result = result.slice(0, result.length - 2);
      }
    } else {
      if (char.match(/\S/)) {
        result += char;
      }
      isInWord = false;
    }
    lastChar = char;
  }
  return result;
}

function GuildIconText({ name }: { name: string }) {
  const acronym = useMemo(() => calculateDefaultIconAcronym(name), [name]);
  return <div className="flex items-center justify-center h-12 w-12 bg-gray-2">{acronym}</div>;
}

export function GuildIcon({ guild, useAnimatedIcon }: { guild: GuildInfo; useAnimatedIcon: boolean }) {
  if (guild.icon == null) {
    return <GuildIconText name={guild.name} />;
  }
  if (useAnimatedIcon && guild.icon.startsWith("a_")) {
    return <GuildIconImage url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif`} />;
  }
  return <GuildIconImage url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} />;
}
