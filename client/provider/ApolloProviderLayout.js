"use client";

import client from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";

function ApolloProviderLayout({ children }) {
  return (
    <>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </>
  );
}

export default ApolloProviderLayout;
