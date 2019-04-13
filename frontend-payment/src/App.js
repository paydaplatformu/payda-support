import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import { TranslationContextProvider } from "./translations";

import HomePage from "./home-page/HomePage";
import SupportPage from "./support-page/SupportPage";
import AdminPage from "./admin-page/AdminPage";
import ThankYouPage from "./thank-you-page/ThankYouPage";

const client = new ApolloClient({
  uri: "https://payda-support-v2.herokuapp.com/graphql",
});

const App = () => (
  <Router>
    <ApolloProvider client={client}>
      <TranslationContextProvider>
        <Route exact path="/" component={HomePage} />
        <Route path="/support" component={SupportPage} />
        <Route path="/thank-you" component={ThankYouPage} />
        <Route path="/admin" component={AdminPage} />
      </TranslationContextProvider>
    </ApolloProvider>
  </Router>
);

export default App;
