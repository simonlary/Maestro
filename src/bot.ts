import { Client, CommandInteraction, Intents, Interaction, MessageEmbed } from "discord.js";
import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import playdl from "play-dl";
import { Config } from "./config.js";

interface Song {
    title: string;
    url: string;
}

interface ActiveGuild {
    guildId: string;
    voiceConnection: VoiceConnection;
    audioPlayer?: AudioPlayer;
    queue: Song[];
    currentlyPlaying?: Song;
}

export class Bot {

    private readonly activeGuilds = new Map<string, ActiveGuild>();

    public static async create(config: Config) {
        console.log("Creating client...");
        const client = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES]
        });

        console.log("Creating bot...");
        const bot = new Bot(config, client);

        console.log("Logging in...");
        await client.login(config.token);

        return bot;
    }

    private constructor(
        private readonly config: Config,
        private readonly client: Client,
    ) {
        this.client.on("ready", () => console.log("Ready!"));
        this.client.on("disconnect", () => { console.log("Disconnected"); });
        this.client.on("interactionCreate", this.onInteractionCreate);
    }

    public shutdown() {
        console.log("Shutting down...");
        this.client.destroy();
    }

    private onInteractionCreate = async (interaction: Interaction) => {
        if (!interaction.isCommand()) {
            console.warn(`Received an interaction that is not a command : ${interaction.type}`);
            return;
        }

        console.log(`User "${interaction.user.tag}" (${interaction.user.id}) executed command "${interaction.commandName}".`);

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
                default:
                    console.warn(`Received an invalid command name to execute : ${interaction.commandName}`);
                    break;
            }
        } catch (e) {
            console.error(e);
            if (interaction.replied) {
                await interaction.followUp({ content: "Sorry, there was an error executing you command.", ephemeral: true });
            } else {
                await interaction.reply({ content: "Sorry, there was an error executing you command.", ephemeral: true });
            }
        }
    };

    private play = async (interaction: CommandInteraction) => {
        if (interaction.guild == null) {
            await interaction.reply({ content: "You need to be in a server to use commands.", ephemeral: true });
            return;
        }
        const guildId = interaction.guild.id;

        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (member == null) {
            console.error(`"member" is null for user "${interaction.user.tag} (${interaction.user.id})".`);
            await interaction.reply({ content: "Sorry, there was an error executing you command.", ephemeral: true });
            return;
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
            console.error(`Invalid subcommand "${subcommand}".`);
            await interaction.editReply({ content: "Sorry, there was an error executing you command." });
            return;
        }


        const songInfo = await playdl.video_info(url);
        const song = {
            title: songInfo.video_details.title ?? "",
            url: songInfo.video_details.url,
        };

        const activeGuild = this.activeGuilds.get(guildId);
        if (activeGuild == null) {
            const voiceConnection = joinVoiceChannel({
                channelId: member.voice.channel.id,
                guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            const newActiveGuild = { guildId, voiceConnection, queue: [song], };
            this.activeGuilds.set(guildId, newActiveGuild);
            await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5_000);
            await this.playNext(newActiveGuild);
        } else {
            activeGuild.queue.push(song);
        }

        const embed = new MessageEmbed()
            .setTitle("Queued Song")
            .setColor(0x6BED0E)
            .setDescription(`[${song.title}](${song.url})`)
            .setThumbnail(songInfo.video_details.thumbnails[0].url);
        await interaction.editReply({ content: "Successfully added a song to the queue!" });
        await interaction.followUp({ embeds: [embed] });
    };

    private playNext = async (activeGuild: ActiveGuild) => {
        activeGuild.currentlyPlaying = activeGuild.queue.shift();
        if (activeGuild.currentlyPlaying == null) {
            activeGuild.voiceConnection.destroy();
            this.activeGuilds.delete(activeGuild.guildId);
            return;
        }

        const stream = await playdl.stream(activeGuild.currentlyPlaying.url);
        const audioResource = createAudioResource(stream.stream, { inputType: stream.type });
        activeGuild.audioPlayer = createAudioPlayer();
        activeGuild.audioPlayer.play(audioResource);
        activeGuild.voiceConnection.subscribe(activeGuild.audioPlayer);

        activeGuild.audioPlayer.once(AudioPlayerStatus.Idle, () => this.playNext(activeGuild));
        activeGuild.audioPlayer.on("error", console.error);
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
        this.activeGuilds.delete(activeGuild.guildId);

        await interaction.reply({ content: "Stopped playback." });
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

        const embed = new MessageEmbed()
            .setTitle("Current Queue")
            .setColor(0x6BED0E);
        if (activeGuild.currentlyPlaying != null) {
            embed.addField("Currently playing song", `[${activeGuild.currentlyPlaying.title}](${activeGuild.currentlyPlaying.url})`);
        }
        if (activeGuild.queue.length > 0) {
            embed.addField("Queue", activeGuild.queue.map((s, i) => `${i + 1}. [${s.title}](${s.url})`).join("\n"));
        }
        await interaction.reply({ embeds: [embed] });
    };
}
