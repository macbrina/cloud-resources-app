import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// connect
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const wsClient = createClient({
  url: "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
  },
  on: {
    connected: () => console.log("WebSocket connected"),
    disconnected: () => console.log("WebSocket disconnected"),
    error: (error) => console.error("WebSocket error:", error),
  },
});

const wsLink = new GraphQLWsLink(wsClient);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  credentials: "include",
  connectToDevTools: true,
});

export default client;
