import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import { PubSub } from "graphql-subscriptions";
import { createServer } from "http";
import { useServer } from "graphql-ws/lib/use/ws";
import { execute, subscribe } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import WebSocket from "ws";

const pubsub = new PubSub();
const PORT = 4000;

const typeDefs = gql`
  type CloudResource {
    id: ID!
    name: String!
    type: String!
    status: String!
  }

  type Query {
    cloudResources(
      filter: String
      type: String
      status: String
    ): [CloudResource]
  }

  type Subscription {
    resourceUpdated: CloudResource
  }
`;

const resolvers = {
  Query: {
    cloudResources: (_, { filter, type, status }) => {
      const resources = [
        { id: "1", name: "Compute Engine", type: "VM", status: "Active" },
        {
          id: "2",
          name: "User Database",
          type: "Database",
          status: "Inactive",
        },
        { id: "3", name: "Object Storage", type: "Storage", status: "Active" },
        {
          id: "4",
          name: "App Container",
          type: "Container",
          status: "Pending",
        },
        {
          id: "5",
          name: "Traffic Load Balancer",
          type: "Load Balancer",
          status: "Active",
        },
      ];
      return resources.filter((resource) => {
        const matchesFilter =
          !filter || resource.name.toLowerCase().includes(filter.toLowerCase());
        const matchesType = !type || resource.type === type;
        const matchesStatus = !status || resource.status === status;
        return matchesFilter && matchesType && matchesStatus;
      });
    },
  },
  Subscription: {
    resourceUpdated: {
      subscribe: () => pubsub.asyncIterator("RESOURCE_UPDATED"),
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();
const server = new ApolloServer({ schema });
await server.start();
server.applyMiddleware({ app });

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );

  const wsServer = new WebSocket.Server({
    server: httpServer,
    path: "/graphql",
  });

  useServer({ schema, execute, subscribe }, wsServer);

  console.log(`🚀 WebSocket server running on ws://localhost:${PORT}/graphql`);
});
