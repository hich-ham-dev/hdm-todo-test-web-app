import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App /> 
    </ApolloProvider>
  </React.StrictMode>,
);
