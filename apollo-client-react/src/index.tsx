import React from 'react';
import { createRoot } from 'react-dom/client'

import Pages from './pages';
import GlobalStyles from './styles';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const root = createRoot(document.getElementById('root')!);

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql/",
  cache: new InMemoryCache(),
});

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <GlobalStyles />
      <Pages />
    </ApolloProvider>
  </React.StrictMode>
);