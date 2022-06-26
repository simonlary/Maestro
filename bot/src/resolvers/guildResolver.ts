import { FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Bot } from "../bot.js";
import { Guild } from "../schema/guild.js";

export function createResolver(bot: Bot) {
  @Resolver(Guild)
  class GuildResolver {
    @Query(() => [Guild])
    async guilds() {
      return [...bot.getActiveGuilds().values()].map((x) => ({
        guildId: x.guildId,
      }));
    }

    @FieldResolver()
    async name(@Root() guild: Guild) {
      return bot.getGuildInfos(guild.guildId).name;
    }

    @FieldResolver()
    async icon(@Root() guild: Guild) {
      return bot.getGuildInfos(guild.guildId).icon;
    }
  }

  return GuildResolver;
}
