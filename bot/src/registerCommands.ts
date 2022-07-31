import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import { Config } from "./config.js";

export async function registerCommands(client: Client, config: Config) {
  const applicationId = client.application?.id;
  if (applicationId == null) {
    throw new Error("Couldn't get the application id.");
  }

  const play = new SlashCommandBuilder()
    .setDMPermission(false)
    .setName("play")
    .setDescription("Add a video/song to the queue.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Queue a video by some search terms")
        .addStringOption((option) => option.setName("search").setDescription("The terms to search.").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("url")
        .setDescription("Queue a video by its URL")
        .addStringOption((option) => option.setName("url").setDescription("The url to play.").setRequired(true))
    )
    .toJSON();
  const stop = new SlashCommandBuilder()
    .setDMPermission(false)
    .setName("stop")
    .setDescription("Stop the music playback.")
    .toJSON();
  const skip = new SlashCommandBuilder()
    .setDMPermission(false)
    .setName("skip")
    .setDescription("Skip the currently playing song.")
    .toJSON();
  const pause = new SlashCommandBuilder()
    .setDMPermission(false)
    .setName("pause")
    .setDescription("Pause the currently playing song.")
    .toJSON();
  const resume = new SlashCommandBuilder()
    .setDMPermission(false)
    .setName("resume")
    .setDescription("Resume the currently paused song.")
    .toJSON();
  const queue = new SlashCommandBuilder()
    .setDMPermission(false)
    .setName("queue")
    .setDescription("Show the currently queued songs.")
    .toJSON();
  const dashboard = new SlashCommandBuilder()
    .setDMPermission(true)
    .setName("dashboard")
    .setDescription("Get the control dashboard link.")
    .toJSON();

  const commands = [play, stop, skip, pause, resume, queue, dashboard];

  const rest = new REST().setToken(config.token);
  if (config.debugGuilds.length === 0) {
    await rest.put(Routes.applicationCommands(applicationId), {
      body: commands,
    });
  } else {
    for (const guildId of config.debugGuilds) {
      await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
        body: commands,
      });
    }
  }
}
