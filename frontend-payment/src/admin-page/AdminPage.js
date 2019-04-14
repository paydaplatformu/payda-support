import React, { Component } from "react";
import { Admin, Resource } from "react-admin";
import buildGraphQLProvider from "ra-data-graphql-simple";

import { DonationList } from "./donation";
import { PackageCreate, PackageEdit, PackageList } from "./package";
import authProvider from "./authProvider";
import i18nProvider from "./i18nProvider";
import { client } from "./dataProvider";

class AdminPage extends Component {
  state = { provider: null };

  componentDidMount() {
    buildGraphQLProvider({ client }).then(provider =>
      this.setState({ provider })
    );
  }

  render() {
    if (!this.state.provider) {
      return <div>Loading!</div>;
    }

    return (
      <Admin
        dataProvider={this.state.provider}
        authProvider={authProvider}
        i18nProvider={i18nProvider}
      >
        <Resource name="Donation" list={DonationList} />
        <Resource
          name="Package"
          list={PackageList}
          edit={PackageEdit}
          create={PackageCreate}
        />
      </Admin>
    );
  }
}

export default AdminPage;
