import { Query, Resolver } from "type-graphql";
import { Bot } from "../bot.js";
import { Guild } from "../schema/guild.js";

export function createResolver(bot: Bot) {
  @Resolver(Guild)
  class GuildResolver {
    @Query(() => [Guild])
    async guilds() {
      return [...bot.getActiveGuilds().values()].map((activeGuild) => {
        return {
          id: activeGuild.guildInfo.id,
          name: activeGuild.guildInfo.name,
          icon: activeGuild.guildInfo.icon,
          currentlyPlaying: activeGuild.currentlyPlaying,
          queue: activeGuild.queue,
        };
      });
    }
  }

  return GuildResolver;
}
