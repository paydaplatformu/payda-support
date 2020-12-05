import ApolloClient from "apollo-boost";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AdminPage from "./admin-page/AdminPage";
import { client } from "./admin-page/dataProvider";
import SupportPage from "./support-page/SupportPage";
import ThankYouPage from "./thank-you-page/ThankYouPage";
import ErrorPage from "./error-page/ErrorPage";
import { TranslationContextProvider } from "./translations";

const userClient = new ApolloClient({
  uri: "/graphql",
});

const App = () => (
  <Router>
    <TranslationContextProvider>
      <ApolloProvider client={userClient}>
        <Route exact path="/" component={SupportPage} />
        <Route path="/thank-you" component={ThankYouPage} />
        <Route path="/error" component={ErrorPage} />
      </ApolloProvider>
      <ApolloProvider client={client}>
        <Route path="/admin" component={AdminPage} />
      </ApolloProvider>
    </TranslationContextProvider>
  </Router>
);

export default App;
