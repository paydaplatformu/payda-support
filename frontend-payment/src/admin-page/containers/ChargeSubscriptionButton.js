import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import React from "react";
import { showNotification, refreshView } from "react-admin";
import { Mutation } from "react-apollo";
import { connect } from "react-redux";

const CHARGE_SUBSCRIPTION = gql`
  mutation ChargeSubscription($id: String!) {
    chargeSubscription(id: $id) {
      status
      body
    }
  }
`;

const ChargeSubscriptionButton = ({
  record,
  showNotification,
  refreshView,
  ...buttonProps
}) => (
  <Mutation
    mutation={CHARGE_SUBSCRIPTION}
    onCompleted={data => {
      if (data.status) {
        showNotification("Subscription charged");
      } else {
        showNotification(
          "Error. Failed to charge. Click on subscription for more details"
        );
      }
    }}
  >
    {chargeSubscription => (
      <Button
        {...buttonProps}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          chargeSubscription({ variables: { id: record.id } });
          refreshView();
        }}
      >
        Charge
      </Button>
    )}
  </Mutation>
);

ChargeSubscriptionButton.propTypes = {
  record: PropTypes.object,
  showNotification: PropTypes.func,
  refreshView: PropTypes.func
};

export default connect(
  null,
  {
    showNotification,
    refreshView
  }
)(ChargeSubscriptionButton);
