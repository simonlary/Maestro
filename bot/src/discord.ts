import { REST, Routes, Snowflake } from "discord.js";
import { Cache } from "./utils/cache.js";

export interface UserData {
  id: Snowflake;
  username: string;
  avatar: string | null;
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
  const rest = new REST({ authPrefix: "Bearer" }).setToken(accessToken);
  return (await rest.get(Routes.user())) as UserData;
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
  const rest = new REST({ authPrefix: "Bearer" }).setToken(accessToken);
  return (await rest.get(Routes.userGuilds())) as GuildData[];
}
