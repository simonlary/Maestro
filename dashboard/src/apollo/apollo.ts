import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

export function createApolloClient() {
  const httpLink = new HttpLink({
    uri: `http://${process.env.REACT_APP_BOT_URL}`,
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: `ws://${process.env.REACT_APP_BOT_URL}`,
      connectionParams: {
        authorization: process.env.REACT_APP_DASHBOARD_TOKEN,
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
    operation.setContext({ headers: { authorization: process.env.REACT_APP_DASHBOARD_TOKEN } });
    return forward(operation);
  });

  return new ApolloClient({
    link: httpAuth.concat(splitLink),
    cache: new InMemoryCache(),
  });
}
