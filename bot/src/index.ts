import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Bot } from "./bot.js";
import { Config } from "./config.js";
import * as path from "path";
import { fileURLToPath } from "url";
import { ApolloServer } from "apollo-server";
import { createResolver } from "./resolvers/guildResolver.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Loading config...");
const config = new Config();

console.log("Instanciating bot...");
const bot = await Bot.create(config);

console.log("Building API schema...");
const schema = await buildSchema({
  resolvers: [createResolver(bot)],
  emitSchemaFile: path.resolve(__dirname, "schema.gql"),
});

console.log("Creating Apollo server...");
const server = new ApolloServer({
  schema,
});

console.log("Starting Apollo server...");
const { url } = await server.listen({ port: config.apolloServerPort });
console.log(`Listening on: ${url}`);

process.addListener("SIGINT", () => {
  bot.shutdown();
});

process.addListener("SIGTERM", () => {
  bot.shutdown();
});
