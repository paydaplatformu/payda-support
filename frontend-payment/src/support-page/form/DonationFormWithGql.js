import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Spin } from "antd";
import DonationFormInner from "./DonationForm";
import InnerHTML from "dangerously-set-html-content";

const CREATE_DONATION = gql`
  mutation CreateDonation($donationInput: DonationInput!, $language: LanguageCode!) {
    createDonation(donationInput: $donationInput, language: $language) {
      formHtmlTags
    }
  }
`;

class DonationForm extends Component {
  render() {
    return (
      <Mutation mutation={CREATE_DONATION}>
        {(createDonation, { loading, error, data }) => {
          if (error) return <p>Error!</p>;
          if (data?.createDonation?.formHtmlTags?.length === 0) return <p>Error!</p>;

          if (loading) {
            return <Spin size="large" spinning={loading || !!data} />;
          }

          return (
            <>
              {!data && <DonationFormInner createDonation={createDonation} />}
              {data && data.createDonation.formHtmlTags.map((tag, index) => <InnerHTML key={index} html={tag} />)}
            </>
          );
        }}
      </Mutation>
    );
  }
}

export default DonationForm;
