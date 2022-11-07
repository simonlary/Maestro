import { AudioPlayerStatus } from "@discordjs/voice";
import { Snowflake } from "discord.js";
import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root, Subscription } from "type-graphql";
import { Context } from "../authentication.js";
import { GuildData } from "../discord.js";
import { Guild } from "../schema/guild.js";
import { PlaybackStatus } from "../schema/playbackStatus.js";

@Resolver(Guild)
export class GuildResolver {
  @Authorized()
  @Query(() => [Guild])
  async guilds(@Ctx() context: Context): Promise<Guild[]> {
    return context.user?.guilds.map(this.guildDataToGuild) ?? [];
  }

  @Authorized()
  @Query(() => Guild)
  async guild(@Ctx() context: Context, @Arg("guildId") guildId: Snowflake): Promise<Guild> {
    const guildData = context.user?.guilds.find((g) => g.id === guildId);
    if (guildData == null) {
      throw new Error(`User not in a guild with guildId : ${guildId}`);
    }
    return this.guildDataToGuild(guildData);
  }

  @FieldResolver()
  async playbackStatus(@Ctx() context: Context, @Root() guild: Guild): Promise<PlaybackStatus | undefined> {
    const activeGuild = context.bot.getActiveGuilds().get(guild.id);
    if (activeGuild == null) {
      return undefined;
    }
    return {
      isPlaying: activeGuild.audioPlayer?.state.status === AudioPlayerStatus.Playing,
      currentTime: Math.round((activeGuild.audioResource?.playbackDuration ?? 0) / 1000),
      currentlyPlaying: activeGuild.currentlyPlaying,
      queue: activeGuild.queue,
    };
  }

  @Authorized()
  @Mutation(() => Boolean)
  async resume(@Ctx() context: Context, @Arg("guildId") guildId: Snowflake): Promise<boolean> {
    const guild = context.bot.getActiveGuilds().get(guildId);
    if (guild == null) {
      throw new Error(`No guild with guildId : ${guildId}`);
    }
    if (guild.audioPlayer == null) {
      throw new Error(`Nothing playing on guild with guildId : ${guildId}`);
    }
    return guild.audioPlayer.unpause();
  }

  @Authorized()
  @Mutation(() => Boolean)
  async pause(@Ctx() context: Context, @Arg("guildId") guildId: Snowflake): Promise<boolean> {
    const guild = context.bot.getActiveGuilds().get(guildId);
    if (guild == null) {
      throw new Error(`No guild with guildId : ${guildId}`);
    }
    if (guild.audioPlayer == null) {
      throw new Error(`Nothing playing on guild with guildId : ${guildId}`);
    }
    return guild.audioPlayer.pause(true);
  }

  @Authorized()
  @Mutation(() => Boolean)
  async skip(@Ctx() context: Context, @Arg("guildId") guildId: Snowflake): Promise<boolean> {
    const guild = context.bot.getActiveGuilds().get(guildId);
    if (guild == null) {
      throw new Error(`No guild with guildId : ${guildId}`);
    }
    if (guild.audioPlayer == null) {
      throw new Error(`Nothing playing on guild with guildId : ${guildId}`);
    }
    return guild.audioPlayer.stop();
  }

  @Authorized()
  @Mutation(() => String)
  async removeQueuedSong(
    @Ctx() context: Context,
    @Arg("guildId") guildId: Snowflake,
    @Arg("songId") songId: string
  ): Promise<string> {
    const song = context.bot.removeSongFromQueue(guildId, songId);
    return song.id;
  }

  @Authorized()
  @Mutation(() => String)
  async queueSong(
    @Ctx() context: Context,
    @Arg("guildId") guildId: Snowflake,
    @Arg("songUrl") songUrl: string
  ): Promise<string> {
    const song = await context.bot.queueSong(guildId, songUrl);
    return song.id;
  }

  @Authorized()
  @Subscription(() => Guild, {
    topics: "GUILD_UPDATED",
    filter: ({ payload, args, context }) =>
      payload === args.guildId && context.user?.guilds.some((g: GuildData) => g.id === payload),
  })
  async guildUpdated(@Ctx() context: Context, @Arg("guildId") guildId: Snowflake): Promise<Guild> {
    const guildData = context.user?.guilds.find((g) => g.id === guildId);
    if (guildData == null) {
      throw new Error(`No guild with guildId : ${guildId}`);
    }
    return this.guildDataToGuild(guildData);
  }

  private guildDataToGuild(guildData: GuildData): Guild {
    return {
      id: guildData.id,
      name: guildData.name,
      icon: guildData.icon ?? undefined,
    };
  }
}
