import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import { TR, TranslationContext } from "./translations";

import HomePage from "./home-page/HomePage";
import SupportPage from "./support-page/SupportPage";
import AdminPage from "./admin-page/AdminPage";

const client = new ApolloClient({
  uri: "https://payda-support-v2.herokuapp.com/graphql",
});

const App = () => (
  <Router>
    <ApolloProvider client={client}>
      <TranslationContext.Provider value={TR}>
        <Route exact path="/" component={HomePage} />
        <Route path="/support" component={SupportPage} />
        <Route path="/admin" component={AdminPage} />
      </TranslationContext.Provider>
    </ApolloProvider>
  </Router>
);

export default App;
