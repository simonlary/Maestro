import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import * as path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import { ApolloServerPluginDrainWsServer, ApolloServerPluginLogger } from "./apolloServerPlugins.js";
import { authChecker, buildCreateContextFunction, buildCreateWsContextFunction } from "./authentication.js";
import { Bot } from "./bot.js";
import { Config } from "./config.js";
import { GuildResolver } from "./resolvers/guildResolver.js";
import { LogResolver } from "./resolvers/logResolver.js";
import { SettingsResolver } from "./resolvers/settingsResolver.js";
import { SongResolver } from "./resolvers/songResolver.js";
import { UserResolver } from "./resolvers/userResolver.js";
import { logger } from "./utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

logger.info("Loading config...");
const config = new Config();

logger.info("Creating PubSub...");
const pubSub = new PubSub();

logger.info("Creating Bot...");
const bot = await Bot.create(config, pubSub);

logger.info("Building API schema...");
const schema = await buildSchema({
  resolvers: [GuildResolver, LogResolver, SettingsResolver, SongResolver, UserResolver],
  emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  pubSub,
  authChecker,
});

logger.info("Creating HTTP server...");
const app = express();
const httpServer = createServer(app);

logger.info("Creating WebSocket server...");
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/",
});
const serverCleanup = useServer(
  {
    schema,
    context: buildCreateWsContextFunction(bot, config),
  },
  wsServer
);

logger.info("Creating Apollo server...");
const server = new ApolloServer({
  schema,
  context: buildCreateContextFunction(bot, config),
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginDrainWsServer(serverCleanup),
    ApolloServerPluginLogger(),
  ],
});

logger.info("Starting Apollo server...");
await server.start();
server.applyMiddleware({ app, path: "/" });
const port = process.env.PORT || 3001;
await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
logger.info(`Listening on port ${port}`);

process.addListener("SIGINT", () => {
  bot.shutdown();
});

process.addListener("SIGTERM", () => {
  bot.shutdown();
});
