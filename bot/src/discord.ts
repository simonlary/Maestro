import { Snowflake } from "discord.js";
import { logger } from "./logger.js";
import fetch from "node-fetch";

interface UserData {
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

export async function getUserData(accessToken: string) {
  const response = await fetch("https://discordapp.com/api/v9/users/@me", {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    logger.error(`Error getting user data (${response.status}) : ${await response.text()}`);
    throw new Error("Error getting user data.");
  }

  const data = (await response.json()) as UserData;

  return data;
}

interface GuildData {
  id: Snowflake;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

export async function getGuildsData(accessToken: string) {
  const response = await fetch("https://discordapp.com/api/v9/users/@me/guilds", {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    logger.error(`Error getting guilds data (${response.status}) : ${await response.text()}`);
    throw new Error("Error getting guilds data.");
  }

  const data = (await response.json()) as GuildData[];

  return data;
}
