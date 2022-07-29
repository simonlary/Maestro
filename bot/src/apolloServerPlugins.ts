import { GraphQLRequestContext, PluginDefinition } from "apollo-server-core";
import { Disposable } from "graphql-ws";
import crypto from "crypto";
import logger from "./utils/logger.js";
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
      if (requestContext.request.operationName === "IntrospectionQuery") return; // TODO : Remove this

      const requestLogger = logger.child({ requestId: crypto.randomUUID() });
      requestContext.logger = requestLogger;
      requestLogger.info(
        {
          operationName: requestContext.request.operationName,
          query: requestContext.request.query,
          variables: requestContext.request.variables,
          user:
            requestContext.context.user == null
              ? undefined
              : {
                  id: requestContext.context.user.id,
                  username: requestContext.context.user.username,
                  discriminator: requestContext.context.user.discriminator,
                },
        },
        "Request received"
      );

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
