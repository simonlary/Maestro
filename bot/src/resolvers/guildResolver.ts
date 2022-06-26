import { Arg, Query, Resolver } from "type-graphql";
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

    @Query(() => Guild)
    async guild(@Arg("guildId") guildId: string) {
      const guild = [...bot.getActiveGuilds().values()].find((g) => g.guildInfo.id === guildId);
      if (guild == null) {
        throw new Error(`No guild with guildId : ${guildId}`);
      }
      return {
        id: guild.guildInfo.id,
        name: guild.guildInfo.name,
        icon: guild.guildInfo.icon,
        currentlyPlaying: guild.currentlyPlaying,
        queue: guild.queue,
      };
    }
  }

  return GuildResolver;
}
