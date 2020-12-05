import buildGraphQLProvider from "ra-data-graphql-simple";
import React, { Component } from "react";
import { Admin, Resource } from "react-admin";
import authProvider from "./authProvider";
import { client } from "./dataProvider";
import { DonationList, DonationShow } from "./donation";
import { SubscriptionList, SubscriptionShow } from "./subscription";
import { ChargableSubscriptionList, ChargableSubscriptionShow } from "./chargable-subscription";
import { PackageCreate, PackageEdit, PackageList } from "./package";

class AdminPage extends Component {
  state = { provider: null };

  componentDidMount() {
    buildGraphQLProvider({ client }).then(provider => this.setState({ provider }));
  }

  render() {
    if (!this.state.provider) {
      return <div>Loading!</div>;
    }

    return (
      <Admin dataProvider={this.state.provider} authProvider={authProvider}>
        <Resource name="Donation" list={DonationList} show={DonationShow} />
        <Resource name="Package" list={PackageList} edit={PackageEdit} create={PackageCreate} />
        <Resource name="Subscription" list={SubscriptionList} show={SubscriptionShow} />
        <Resource name="ChargableSubscription" list={ChargableSubscriptionList} show={ChargableSubscriptionShow} />
      </Admin>
    );
  }
}

export default AdminPage;
