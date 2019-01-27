import React, { Component } from "react";
import { Admin, Resource } from "react-admin";
import ApolloClient from "apollo-boost";
import buildGraphQLProvider from "ra-data-graphql-simple";

import { DonationList } from "./DonationList";
import { PackageList } from "./PackageList";

const client = new ApolloClient({
  uri: "http://192.168.178.39:8080/graphql",
});

class AdminPage extends Component {
  state = { provider: null };

  componentDidMount() {
    buildGraphQLProvider({ client }).then(provider =>
      this.setState({ provider }),
    );
  }

  render() {
    if (!this.state.provider) {
      return <div>Loading!</div>;
    }

    return (
      <Admin dataProvider={this.state.provider}>
        <Resource name="Donation" list={DonationList} />
        <Resource name="Package" list={PackageList} />
      </Admin>
    );
  }
}

export default AdminPage;
