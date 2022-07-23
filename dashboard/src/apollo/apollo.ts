import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const isProduction = process.env.NODE_ENV === "production";
const BOT_URL = isProduction ? window.BOT_URL : process.env.REACT_APP_BOT_URL;

export function createApolloClient() {
  const httpLink = new HttpLink({
    uri: `http://${BOT_URL}`,
  });

  const token = localStorage.getItem("accessToken");
  const wsLink = new GraphQLWsLink(
    createClient({
      url: `ws://${BOT_URL}`,
      connectionParams: {
        authorization: token,
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
    const token = localStorage.getItem("accessToken");
    operation.setContext({ headers: { authorization: token } });
    return forward(operation);
  });

  return new ApolloClient({
    link: httpAuth.concat(splitLink),
    cache: new InMemoryCache(),
  });
}
