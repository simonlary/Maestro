import { ApolloClient, InMemoryCache } from "@apollo/client";

export function createApolloClient() {
  return new ApolloClient({
    uri: "http://localhost:3001",
    cache: new InMemoryCache(),
  });
}
