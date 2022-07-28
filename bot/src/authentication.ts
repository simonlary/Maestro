import { ExpressContext } from "apollo-server-express";
import { AuthChecker } from "type-graphql";
import { Bot } from "./bot.js";
import { Config } from "./config.js";
import { getGuildsData, getUserData, GuildData, UserData } from "./discord.js";

export interface Context {
  bot: Bot;
  config: Config;
  user?: UserData & { guilds: GuildData[] };
}

export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  if (context.user == null) {
    return false;
  }

  if (roles.includes("ADMIN")) {
    return context.config.adminUsers.includes(context.user.id);
  }

  return true;
};

export function buildCreateContextFunction(
  bot: Bot,
  config: Config
): (expressContext: ExpressContext) => Promise<Context> {
  return async ({ req }) => {
    return { bot, config, user: await getUserFromToken(req.headers.authorization) };
  };
}

type WebSocketContext = { connectionParams?: { authorization?: string } };

export function buildCreateWsContextFunction(
  bot: Bot,
  config: Config
): (wsContext: WebSocketContext) => Promise<Context> {
  return async (wsContext) => {
    return { bot, config, user: await getUserFromToken(wsContext.connectionParams?.authorization) };
  };
}

async function getUserFromToken(token?: string) {
  if (token == null) {
    return undefined;
  }

  const userData = await getUserData(token);
  const guilds = await getGuildsData(token);

  if (userData == null || guilds == null) {
    return undefined;
  }

  return { ...userData, guilds };
}
