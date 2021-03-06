import { AudioPlayerStatus } from "@discordjs/voice";
import { Snowflake } from "discord.js";
import { Arg, Authorized, Mutation, Query, Resolver, Root, Subscription } from "type-graphql";
import { ActiveGuild, Bot } from "../bot.js";
import { logger } from "../logger.js";
import { Guild } from "../schema/guild.js";

export function createGuildResolver(bot: Bot) {
  @Resolver(Guild)
  class GuildResolver {
    @Authorized()
    @Query(() => [Guild])
    async guilds(): Promise<Guild[]> {
      return [...bot.getActiveGuilds().values()].map((activeGuild) => {
        return this.activeGuildToGuild(activeGuild);
      });
    }

    @Authorized()
    @Query(() => Guild)
    async guild(@Arg("guildId") guildId: Snowflake): Promise<Guild> {
      const guild = bot.getActiveGuilds().get(guildId);
      if (guild == null) {
        throw new Error(`No guild with guildId : ${guildId}`);
      }
      return this.activeGuildToGuild(guild);
    }

    @Authorized()
    @Mutation(() => Boolean)
    async resume(@Arg("guildId") guildId: Snowflake): Promise<boolean> {
      const guild = bot.getActiveGuilds().get(guildId);
      if (guild == null) {
        throw new Error(`No guild with guildId : ${guildId}`);
      }
      if (guild.audioPlayer == null) {
        throw new Error(`Nothing playing on guild with guildId : ${guildId}`);
      }

      logger.info(`Command "resume" executed from the dashboard in guild "${guild.guildInfo.name}"`);
      return guild.audioPlayer.unpause();
    }

    @Authorized()
    @Mutation(() => Boolean)
    async pause(@Arg("guildId") guildId: Snowflake): Promise<boolean> {
      const guild = bot.getActiveGuilds().get(guildId);
      if (guild == null) {
        throw new Error(`No guild with guildId : ${guildId}`);
      }
      if (guild.audioPlayer == null) {
        throw new Error(`Nothing playing on guild with guildId : ${guildId}`);
      }

      logger.info(`Command "pause" executed from the dashboard in guild "${guild.guildInfo.name}"`);
      return guild.audioPlayer.pause(true);
    }

    @Authorized()
    @Mutation(() => Boolean)
    async skip(@Arg("guildId") guildId: Snowflake): Promise<boolean> {
      const guild = bot.getActiveGuilds().get(guildId);
      if (guild == null) {
        throw new Error(`No guild with guildId : ${guildId}`);
      }
      if (guild.audioPlayer == null) {
        throw new Error(`Nothing playing on guild with guildId : ${guildId}`);
      }

      logger.info(`Command "skip" executed from the dashboard in guild "${guild.guildInfo.name}"`);
      return guild.audioPlayer.stop();
    }

    @Authorized()
    @Mutation(() => String)
    async removeQueuedSong(@Arg("guildId") guildId: Snowflake, @Arg("songId") songId: string): Promise<string> {
      const song = bot.removeSongFromQueue(guildId, songId);
      return song.id;
    }

    @Authorized()
    @Mutation(() => String)
    async queueSong(@Arg("guildId") guildId: Snowflake, @Arg("songUrl") songUrl: string): Promise<string> {
      const song = await bot.queueSong(guildId, songUrl);
      return song.id;
    }

    @Authorized()
    @Subscription(() => Guild, {
      topics: "GUILD_UPDATED",
      filter: ({ payload, args }) => payload.guildInfo.id === args.guildId,
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async guildUpdated(@Root() guild: ActiveGuild, @Arg("guildId") guildId: Snowflake): Promise<Guild> {
      return this.activeGuildToGuild(guild);
    }

    private activeGuildToGuild(activeGuild: ActiveGuild): Guild {
      return {
        id: activeGuild.guildInfo.id,
        name: activeGuild.guildInfo.name,
        icon: activeGuild.guildInfo.icon,
        currentlyPlaying: activeGuild.currentlyPlaying,
        playbackStatus: {
          isPlaying: activeGuild.audioPlayer?.state.status === AudioPlayerStatus.Playing,
          currentTime: Math.round((activeGuild.audioResource?.playbackDuration ?? 0) / 1000),
        },
        queue: activeGuild.queue,
      };
    }
  }

  return GuildResolver;
}
