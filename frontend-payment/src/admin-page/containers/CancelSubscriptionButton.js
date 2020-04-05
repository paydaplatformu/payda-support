import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import React from "react";
import { showNotification, refreshView } from "react-admin";
import { Mutation } from "react-apollo";
import { connect } from "react-redux";

const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription($id: String!) {
    cancelSubscription(id: $id) {
      id
    }
  }
`;

const CancelSubscriptionButton = ({
  record,
  showNotification,
  refreshView,
  ...buttonProps
}) => (
  <Mutation
    mutation={CANCEL_SUBSCRIPTION}
    onCompleted={data => {
      if (data.cancelSubscription.id) {
        showNotification("Subscription cancelled");
        refreshView();
      } else {
        showNotification("Error. Failed to cancel.");
      }
    }}
  >
    {cancelSubscription => (
      <Button
        {...buttonProps}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          cancelSubscription({ variables: { id: record.id } });
        }}
      >
        Cancel
      </Button>
    )}
  </Mutation>
);

CancelSubscriptionButton.propTypes = {
  record: PropTypes.object,
  showNotification: PropTypes.func,
  refreshView: PropTypes.func
};

export default connect(null, {
  showNotification,
  refreshView
})(CancelSubscriptionButton);
