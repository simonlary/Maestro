import { PluginDefinition } from "apollo-server-core";
import { Disposable } from "graphql-ws";
import logger from "./utils/logger";

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
    async requestDidStart(requestContext) {
      if (requestContext.request.operationName === "IntrospectionQuery") return; // TODO : Remove this

      requestContext.logger = logger.child({ requestId: crypto.randomUUID() });
      requestContext.logger.info({
        operationName: requestContext.request.operationName,
        query: requestContext.request.query,
        variables: requestContext.request.variables,
      });

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
