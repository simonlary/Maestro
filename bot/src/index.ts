import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Bot } from "./bot.js";
import { Config } from "./config.js";
import * as path from "path";
import { fileURLToPath } from "url";
import { ApolloServer } from "apollo-server";
import { createGuildResolver } from "./resolvers/guildResolver.js";
import { createSettingsResolver } from "./resolvers/settingsResolver.js";
import { createLogResolver } from "./resolvers/logResolver.js";
import { logger } from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

logger.info("Loading config...");
const config = new Config();

logger.info("Instanciating bot...");
const bot = await Bot.create(config);

logger.info("Building API schema...");
const schema = await buildSchema({
  resolvers: [createGuildResolver(bot), createSettingsResolver(bot), createLogResolver()],
  emitSchemaFile: path.resolve(__dirname, "schema.gql"),
});

logger.info("Creating Apollo server...");
const server = new ApolloServer({
  schema,
});

logger.info("Starting Apollo server...");
const { url } = await server.listen({ port: config.apolloServerPort });
logger.info(`Listening on: ${url}`);

process.addListener("SIGINT", () => {
  bot.shutdown();
});

process.addListener("SIGTERM", () => {
  bot.shutdown();
});
