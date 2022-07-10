import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const isProduction = process.env.NODE_ENV === "production";
const BOT_URL = isProduction ? window.BOT_URL : process.env.REACT_APP_BOT_URL;
const DASHBOARD_TOKEN = isProduction ? window.DASHBOARD_TOKEN : process.env.REACT_APP_DASHBOARD_TOKEN;

console.log(isProduction);
console.log(BOT_URL);
console.log(DASHBOARD_TOKEN);

export function createApolloClient() {
  const httpLink = new HttpLink({
    uri: `http://${BOT_URL}`,
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: `ws://${BOT_URL}`,
      connectionParams: {
        authorization: DASHBOARD_TOKEN,
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
    operation.setContext({ headers: { authorization: DASHBOARD_TOKEN } });
    return forward(operation);
  });

  return new ApolloClient({
    link: httpAuth.concat(splitLink),
    cache: new InMemoryCache(),
  });
}
