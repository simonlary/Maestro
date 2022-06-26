import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Bot } from "./bot.js";
import { Config } from "./config.js";
import * as path from "path";
import { fileURLToPath } from "url";
import { createGuildResolver } from "./resolvers/guildResolver.js";
import { createSettingsResolver } from "./resolvers/settingsResolver.js";
import { createLogResolver } from "./resolvers/logResolver.js";
import { logger } from "./logger.js";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

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

logger.info("Creating Express server...");
const app = express();
const httpServer = http.createServer(app);

logger.info("Creating Apollo server...");
const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

logger.info("Starting Apollo server...");
await server.start();
server.applyMiddleware({ app, path: "/" });
await new Promise<void>((resolve) => httpServer.listen({ port: config.apolloServerPort }, resolve));
logger.info(`Listening on: http://localhost:/${config.apolloServerPort}`);

process.addListener("SIGINT", () => {
  bot.shutdown();
});

process.addListener("SIGTERM", () => {
  bot.shutdown();
});
