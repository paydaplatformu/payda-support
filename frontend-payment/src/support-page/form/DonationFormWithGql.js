import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Spin } from "antd";

import DonationFormInner from "./DonationForm";
import PayUForm from "./PayUForm";
import { TranslationContext } from "../../translations";

const CREATE_DONATION = gql`
  mutation CreateDonation(
    $donationInput: DonationInput!
    $language: LanguageCode!
  ) {
    createDonation(donationInput: $donationInput, language: $language) {
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
              <TranslationContext.Consumer>
                {({ translate }) => (
                  <Spin
                    size="large"
                    tip={translate("redirection_message")}
                    spinning={loading || !!data}
                  >
                    <DonationFormInner createDonation={createDonation} />
                  </Spin>
                )}
              </TranslationContext.Consumer>
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
