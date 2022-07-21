import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Bot } from "./bot.js";
import { Config } from "./config.js";
import * as path from "path";
import { fileURLToPath } from "url";
import { createGuildResolver } from "./resolvers/guildResolver.js";
import { createSettingsResolver } from "./resolvers/settingsResolver.js";
import { createLogResolver } from "./resolvers/logResolver.js";
import { createSongResolver } from "./resolvers/songResolver.js";
import { logger } from "./logger.js";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import { authChecker, createContext, createWsContext } from "./authentification.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

logger.info("Loading config...");
const config = new Config();

logger.info("Creating PubSub...");
const pubSub = new PubSub();

logger.info("Instanciating bot...");
const bot = await Bot.create(config, pubSub);

logger.info("Building API schema...");
const schema = await buildSchema({
  resolvers: [createGuildResolver(bot), createSettingsResolver(bot), createLogResolver(), createSongResolver()],
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
    context: createWsContext,
  },
  wsServer
);

logger.info("Creating Apollo server...");
const server = new ApolloServer({
  schema,
  context: createContext,
  plugins: [
    // Shutdown the HTTP server
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Shutdown the WS server
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  formatError: (e) => {
    logger.error(`GraphQL Error : ${e.message}`);
    return e;
  },
});

logger.info("Starting Apollo server...");
await server.start();
server.applyMiddleware({ app, path: "/" });
const port = process.env.PORT || 3001;
await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
logger.info(`Listening on: http://localhost:${port}`);

process.addListener("SIGINT", () => {
  bot.shutdown();
});

process.addListener("SIGTERM", () => {
  bot.shutdown();
});
