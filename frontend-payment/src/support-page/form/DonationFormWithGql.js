import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Spin } from "antd";

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
  getFormFieldsFromData = data =>
    data.createDonation && data.createDonation.formFields;

  getFormUrlFromData = data =>
    data.createDonation && data.createDonation.formUrl;

  render() {
    return (
      <Mutation mutation={CREATE_DONATION}>
        {(createDonation, { loading, error, data }) => {
          if (error) return <p>Error!</p>;

          return (
            <>
              <Spin
                size="large"
                tip="PayU'ya yönlendiriliyorsunuz"
                spinning={loading || !!data}
              >
                <DonationFormInner createDonation={createDonation} />
              </Spin>
              {data && (
                <PayUForm
                  formFields={this.getFormFieldsFromData(data)}
                  formUrl={this.getFormUrlFromData(data)}
                />
              )}
            </>
          );
        }}
      </Mutation>
    );
  }
}

export default DonationForm;
