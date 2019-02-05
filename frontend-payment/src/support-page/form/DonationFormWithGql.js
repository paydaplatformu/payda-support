import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import DonationFormInner from "./DonationForm";
import PayUForm from "./PayUForm";

const CREATE_DONATION = gql`
  mutation CreateDonation(
    $donationCreator: DonationCreator!
    $language: LanguageCode!
  ) {
    createDonation(donationCreator: $donationCreator, language: $language) {
      formFields {
        key
        value
      }
      formUrl
    }
  }
`;

class DonationForm extends Component {
  render() {
    return (
      <Mutation mutation={CREATE_DONATION}>
        {(createDonation, { loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error!</p>;

          if (!data) {
            return <DonationFormInner createDonation={createDonation} />;
          }

          if (data) {
            const formFields =
              data.createDonation && data.createDonation.formFields;
            const formUrl = data.createDonation && data.createDonation.formUrl;

            return <PayUForm formFields={formFields} formUrl={formUrl} />;
          }
        }}
      </Mutation>
    );
  }
}

export default DonationForm;
