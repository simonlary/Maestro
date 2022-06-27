import { AudioPlayerStatus } from "@discordjs/voice";
import { Arg, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from "type-graphql";
import { Bot } from "../bot.js";
import { Guild } from "../schema/guild.js";

export function createGuildResolver(bot: Bot) {
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
          playbackStatus: {
            isPlaying: activeGuild.audioPlayer?.state.status === AudioPlayerStatus.Playing,
          },
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
        playbackStatus: {
          isPlaying: guild.audioPlayer?.state.status === AudioPlayerStatus.Playing,
        },
        queue: guild.queue,
      };
    }

    @Mutation(() => Boolean)
    async testMutation(@Arg("message") message: string, @PubSub() pubSub: PubSubEngine) {
      await pubSub.publish("TEST", message);
      return false;
    }

    @Subscription(() => String, { topics: "TEST" })
    async guildUpdated(@Root() message: string) {
      return message;
    }
  }

  return GuildResolver;
}
