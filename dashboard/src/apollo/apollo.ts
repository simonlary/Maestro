import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { config } from "../config";

export function createApolloClient() {
  const httpLink = new HttpLink({
    uri: config.httpBotUrl,
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: config.wsBotUrl,
      connectionParams() {
        return {
          authorization: config.accessToken,
        };
      },
    })
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    wsLink,
    httpLink
  );

  const httpAuth = new ApolloLink((operation, forward) => {
    operation.setContext({ headers: { authorization: config.accessToken } });
    return forward(operation);
  });

  return new ApolloClient({
    link: httpAuth.concat(splitLink),
    cache: new InMemoryCache(),
  });
}
