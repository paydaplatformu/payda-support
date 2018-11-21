import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Title from './Title';
import DonationList from './DonationList';
import UserForm from './UserForm';
import LegalLinks from './LegalLinks';

const client = new ApolloClient({
  uri: 'https://payda-support-v2.herokuapp.com/graphql'
});

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <Title />
      <DonationList />
      <UserForm />
      <LegalLinks />
    </div>
  </ApolloProvider>
);

export default App;
