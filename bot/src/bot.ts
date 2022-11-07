import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import crypto from "crypto";
import {
  ChatInputCommandInteraction,
  Client,
  CommandInteraction,
  EmbedBuilder,
  Interaction,
  Snowflake,
} from "discord.js";
import { PubSubEngine } from "graphql-subscriptions";
import playdl from "play-dl";
import { Config } from "./config.js";
import { registerCommands } from "./registerCommands.js";
import { logger } from "./utils/logger.js";

interface GuildInfo {
  id: Snowflake;
  name: string;
  icon?: string;
}

interface Song {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: number;
}

export interface ActiveGuild {
  guildInfo: GuildInfo;
  voiceConnection: VoiceConnection;
  audioResource?: AudioResource;
  audioPlayer?: AudioPlayer;
  currentlyPlaying: Song;
  queue: Song[];
}

export class Bot {
  private readonly activeGuilds = new Map<Snowflake, ActiveGuild>();

  public static async create(config: Config, pubSub: PubSubEngine) {
    logger.info("Creating discord.js client...");
    const client = new Client({
      intents: ["Guilds", "GuildVoiceStates"],
    });

    logger.info("Instanciating bot...");
    const bot = new Bot(config, client, pubSub);

    logger.info("Logging in...");
    await client.login(config.token);

    logger.info("Bot started!");
    return bot;
  }

  private constructor(
    private readonly config: Config,
    private readonly client: Client,
    private readonly pubSub: PubSubEngine
  ) {
    this.client.on("disconnect", () => {
      logger.info("Bot disconnected");
    });
    this.client.on("interactionCreate", this.onInteractionCreate);
  }

  public getActiveGuilds() {
    return this.activeGuilds;
  }

  public async registerCommands() {
    await registerCommands(this.client, this.config);
  }

  public removeSongFromQueue(guildId: Snowflake, songId: string) {
    const guild = this.activeGuilds.get(guildId);
    if (guild == null) {
      throw new Error(`No guild with guildId : ${guildId}`);
    }

    const songIndex = guild.queue.findIndex((s) => s.id === songId);
    if (songIndex === -1) {
      throw new Error(`No song with songId: ${songId}`);
    }

    const song = guild.queue.splice(songIndex, 1)[0];
    this.guildUpdated(guild.guildInfo.id);

    return song;
  }

  public async queueSong(guildId: Snowflake, url: string) {
    const songInfo = await playdl.video_info(url);
    const song = {
      id: crypto.randomUUID(),
      title: songInfo.video_details.title ?? "",
      url: songInfo.video_details.url,
      thumbnail: songInfo.video_details.thumbnails[0].url,
      duration: songInfo.video_details.durationInSec,
    };

    const activeGuild = this.activeGuilds.get(guildId);
    if (activeGuild == null) {
      throw new Error(`Bot is not present in the guild ${guildId}.`);
    }

    activeGuild.queue.push(song);
    this.guildUpdated(activeGuild.guildInfo.id);

    return song;
  }

  public shutdown() {
    this.client.destroy();
  }

  private guildUpdated(guildId: Snowflake) {
    this.pubSub.publish("GUILD_UPDATED", guildId);
  }

  private onInteractionCreate = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) {
      logger.warn(
        `User ${interaction.user.tag} (${interaction.user.id}) used an interaction that is not a command (${interaction.type}).`
      );
      return;
    }

    if (interaction.guild != null) {
      logger.info(
        `User "${interaction.user.tag}" (${interaction.user.id}) executed command "${interaction.commandName}" in guild "${interaction.guild.name}" (${interaction.guild.id}).`
      );
    } else {
      logger.info(
        `User "${interaction.user.tag}" (${interaction.user.id}) executed command "${interaction.commandName}".`
      );
    }

    try {
      switch (interaction.commandName) {
        case "play":
          await this.play(interaction);
          break;
        case "stop":
          await this.stop(interaction);
          break;
        case "skip":
          await this.skip(interaction);
          break;
        case "pause":
          await this.pause(interaction);
          break;
        case "resume":
          await this.resume(interaction);
          break;
        case "queue":
          await this.queue(interaction);
          break;
        case "dashboard":
          await this.dashboard(interaction);
          break;
        default:
          logger.warn(`Received an invalid command name : ${interaction.commandName}`);
          break;
      }
    } catch (error) {
      if (typeof error === "string") {
        logger.error(error);
      } else if (error instanceof Error) {
        logger.error(error.message);
      } else {
        logger.error(`Received unknown error : ${error}`);
      }
      if (interaction.replied) {
        await interaction.followUp({ content: "Sorry, there was an error executing you command.", ephemeral: true });
      } else {
        await interaction.reply({ content: "Sorry, there was an error executing you command.", ephemeral: true });
      }
    }
  };

  private play = async (interaction: ChatInputCommandInteraction) => {
    if (interaction.guild == null) {
      await interaction.reply({ content: "You need to be in a server to use commands.", ephemeral: true });
      return;
    }
    const guildId = interaction.guild.id;

    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (member == null) {
      throw new Error(`"member" is null for user "${interaction.user.tag} (${interaction.user.id})".`);
    }

    if (member.voice.channel == null) {
      await interaction.reply({ content: "You are not currently in any voice channel!", ephemeral: true });
      return;
    }

    // Searching and validating url can take more than 3 seconds so we need to defer the reply
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommand(true);
    let url: string;
    if (subcommand === "search") {
      const searchQuery = interaction.options.getString("search", true);
      const searchResult = await playdl.search(searchQuery, { limit: 1 });
      if (searchResult.length === 0) {
        await interaction.editReply({ content: "No video could be found matching your search." });
        return;
      }
      url = searchResult[0].url;
    } else if (subcommand === "url") {
      url = interaction.options.getString("url", true);
      const urlType = await playdl.validate(url);
      if (urlType !== "yt_video") {
        await interaction.editReply({ content: "Invalid URL!" });
        return;
      }
    } else {
      throw new Error(`Invalid subcommand "${subcommand}".`);
    }

    const songInfo = await playdl.video_info(url);
    const song = {
      id: crypto.randomUUID(),
      title: songInfo.video_details.title ?? "",
      url: songInfo.video_details.url,
      thumbnail: songInfo.video_details.thumbnails[0].url,
      duration: songInfo.video_details.durationInSec,
    };

    const activeGuild = this.activeGuilds.get(guildId);
    if (activeGuild == null) {
      const voiceConnection = joinVoiceChannel({
        channelId: member.voice.channel.id,
        guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
      const guildInfo = { id: guildId, name: interaction.guild.name, icon: interaction.guild.iconURL() ?? undefined };
      const newActiveGuild = { guildInfo, voiceConnection, currentlyPlaying: song, queue: [] };
      this.activeGuilds.set(guildId, newActiveGuild);
      await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5_000);
      await this.playNext(newActiveGuild);
      this.guildUpdated(newActiveGuild.guildInfo.id);
    } else {
      activeGuild.queue.push(song);
      this.guildUpdated(activeGuild.guildInfo.id);
    }

    const embed = new EmbedBuilder()
      .setTitle("Queued Song")
      .setColor(0x6bed0e)
      .setDescription(`[${song.title}](${song.url})`)
      .setThumbnail(song.thumbnail);
    await interaction.editReply({ embeds: [embed] });
  };

  private playNext = async (activeGuild: ActiveGuild) => {
    const stream = await playdl.stream(activeGuild.currentlyPlaying.url);
    activeGuild.audioResource = createAudioResource(stream.stream, { inputType: stream.type });
    activeGuild.audioPlayer = createAudioPlayer();
    activeGuild.audioPlayer.play(activeGuild.audioResource);
    activeGuild.voiceConnection.subscribe(activeGuild.audioPlayer);

    activeGuild.audioPlayer.on("stateChange", () => this.guildUpdated(activeGuild.guildInfo.id));
    activeGuild.audioPlayer.once(AudioPlayerStatus.Idle, () => {
      const nextSong = activeGuild.queue.shift();
      if (nextSong == null) {
        activeGuild.voiceConnection.destroy();
        this.activeGuilds.delete(activeGuild.guildInfo.id);
      } else {
        activeGuild.currentlyPlaying = nextSong;
        this.playNext(activeGuild);
      }
    });
    activeGuild.audioPlayer.on("error", (error) =>
      logger.error(
        `Audio player error in guild "${activeGuild.guildInfo.name}" (${activeGuild.guildInfo.id}) : ${error}`
      )
    );
  };

  private stop = async (interaction: CommandInteraction) => {
    if (interaction.guild == null) {
      await interaction.reply({ content: "You need to be in a server to use commands.", ephemeral: true });
      return;
    }
    const guildId = interaction.guild.id;

    const activeGuild = this.activeGuilds.get(guildId);
    if (activeGuild == null) {
      await interaction.reply({ content: "There is nothing playing right now.", ephemeral: true });
      return;
    }

    activeGuild.voiceConnection.destroy();
    this.activeGuilds.delete(activeGuild.guildInfo.id);

    await interaction.reply({ content: "Stopped playback.", ephemeral: true });
  };

  private skip = async (interaction: CommandInteraction) => {
    if (interaction.guild == null) {
      await interaction.reply({ content: "You need to be in a server to use commands.", ephemeral: true });
      return;
    }
    const guildId = interaction.guild.id;

    const activeGuild = this.activeGuilds.get(guildId);
    if (activeGuild == null || activeGuild.audioPlayer == null) {
      await interaction.reply({ content: "There is nothing playing right now.", ephemeral: true });
      return;
    }

    activeGuild.audioPlayer.stop();
    await interaction.reply({ content: "Successfully skipped the current song.", ephemeral: true });
  };

  private pause = async (interaction: CommandInteraction) => {
    if (interaction.guild == null) {
      await interaction.reply({ content: "You need to be in a server to use commands.", ephemeral: true });
      return;
    }
    const guildId = interaction.guild.id;

    const activeGuild = this.activeGuilds.get(guildId);
    if (activeGuild == null || activeGuild.audioPlayer == null) {
      await interaction.reply({ content: "There is nothing playing right now.", ephemeral: true });
      return;
    }

    if (activeGuild.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      await interaction.reply({ content: "The music is already paused.", ephemeral: true });
      return;
    }

    activeGuild.audioPlayer.pause(true);
    await interaction.reply({ content: "Successfully paused the music.", ephemeral: true });
  };

  private resume = async (interaction: CommandInteraction) => {
    if (interaction.guild == null) {
      await interaction.reply({ content: "You need to be in a server to use commands.", ephemeral: true });
      return;
    }
    const guildId = interaction.guild.id;

    const activeGuild = this.activeGuilds.get(guildId);
    if (activeGuild == null || activeGuild.audioPlayer == null) {
      await interaction.reply({ content: "There is nothing playing right now.", ephemeral: true });
      return;
    }

    if (activeGuild.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      await interaction.reply({ content: "The music is already playing.", ephemeral: true });
      return;
    }

    activeGuild.audioPlayer.unpause();
    await interaction.reply({ content: "Successfully resumed playing the music.", ephemeral: true });
  };

  private queue = async (interaction: CommandInteraction) => {
    if (interaction.guild == null) {
      await interaction.reply({ content: "You need to be in a server to use commands.", ephemeral: true });
      return;
    }
    const guildId = interaction.guild.id;

    const activeGuild = this.activeGuilds.get(guildId);
    if (activeGuild == null) {
      await interaction.reply({ content: "There is nothing playing right now.", ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder().setTitle("Current Queue").setColor(0x6bed0e);
    if (activeGuild.currentlyPlaying != null) {
      embed.addFields({
        name: "Currently playing song",
        value: `[${activeGuild.currentlyPlaying.title}](${activeGuild.currentlyPlaying.url})`,
      });
    }
    if (activeGuild.queue.length > 0) {
      embed.addFields({
        name: "Queue",
        value: activeGuild.queue.map((s, i) => `${i + 1}. [${s.title}](${s.url})`).join("\n"),
      });
    }
    await interaction.reply({ embeds: [embed], ephemeral: true });
  };

  private dashboard = async (interaction: CommandInteraction) => {
    await interaction.reply({ content: this.config.dashboardUrl, ephemeral: true });
  };
}
