import { GraphQLRequestContext, PluginDefinition } from "apollo-server-core";
import { Disposable } from "graphql-ws";
import { logger } from "./utils/logger.js";
import { Context } from "./authentication.js";

export function ApolloServerPluginDrainWsServer(serverCleanup: Disposable): PluginDefinition {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await serverCleanup.dispose();
        },
      };
    },
  };
}

export function ApolloServerPluginLogger(): PluginDefinition {
  return {
    async requestDidStart(requestContext: GraphQLRequestContext<Context>) {
      requestContext.logger = logger;

      let requestLog = `Recevied request named "${requestContext.request.operationName}"\n`;
      requestLog += `query : ${requestContext.request.query}\n`;
      requestLog += `variables : ${JSON.stringify(requestContext.request.variables)}\n`;
      requestLog +=
        requestContext.context.user == null
          ? "user : undefined"
          : `user : ${requestContext.context.user.username}#${requestContext.context.user.discriminator} (${requestContext.context.user.id})`;
      logger.info(requestLog);

      return {
        async didEncounterErrors(requestContext) {
          for (const error of requestContext.errors) {
            requestContext.logger.warn(error);
          }
        },
      };
    },
  };
}
