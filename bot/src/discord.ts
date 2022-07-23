import { Snowflake } from "discord.js";
import fetch from "node-fetch";
import { Cache } from "./utils/cache.js";

export interface UserData {
  id: Snowflake;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags?: number;
  flags?: number;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  mfa_enabled?: boolean;
}

const userDataCache = new Cache(fetchUserData);

export async function getUserData(accessToken: string) {
  return userDataCache.get(accessToken);
}

async function fetchUserData(accessToken: string) {
  const response = await fetch("https://discordapp.com/api/v9/users/@me", {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    return (await response.json()) as UserData;
  }

  return undefined;
}

export interface GuildData {
  id: Snowflake;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

const guildsDataCache = new Cache(fetchGuildsData);

export async function getGuildsData(accessToken: string) {
  return guildsDataCache.get(accessToken);
}

async function fetchGuildsData(accessToken: string) {
  const response = await fetch("https://discordapp.com/api/v9/users/@me/guilds", {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    return (await response.json()) as GuildData[];
  }

  return undefined;
}
