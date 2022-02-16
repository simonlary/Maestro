import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import { Config } from "./config.js";
import { Client } from "discord.js";

async function getApplicationId(token: string) {
    const client = new Client({ intents: [] });
    await client.login(token);
    const id = client.application?.id;
    if (id == null) {
        throw new Error("Couldn't get the application id.");
    }
    client.destroy();
    return id;
}

console.log("Loading config...");
const config = new Config();

console.log("Fetching application id...");
const applicationId = await getApplicationId(config.token);

console.log("Building commands...");
const play = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Add a video/song to the queue.")
    .addSubcommand(subcommand =>
        subcommand
            .setName("search")
            .setDescription("Queue a video by some search terms")
            .addStringOption(option =>
                option
                    .setName("search")
                    .setDescription("The terms to search.")
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("url")
            .setDescription("Queue a video by its URL")
            .addStringOption(option =>
                option
                    .setName("url")
                    .setDescription("The url to play.")
                    .setRequired(true)
            )
    )
    .toJSON();
const stop = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the music playback.")
    .toJSON();
const skip = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the currently playing song.")
    .toJSON();
const pause = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the currently playing song.")
    .toJSON();
const resume = new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the currently paused song.")
    .toJSON();
const queue = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the currently queued songs.")
    .toJSON();

const commands = [play, stop, skip, pause, resume, queue];

console.log("Registering commands...");
const rest = new REST({ version: "9" }).setToken(config.token);
if (config.debugGuilds.length === 0) {
    await rest.put(Routes.applicationCommands(applicationId), { body: commands });
} else {
    for (const guildId of config.debugGuilds) {
        await rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commands });
    }
}
