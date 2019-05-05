import React from "react";
import {
  BooleanInput,
  Datagrid,
  Filter,
  List,
  ReferenceInput,
  SelectInput
} from "react-admin";
import { SUBSCRIPTION_STATUS } from "../../constants";
import { subscriptionStatusChoices } from "../../utils";
import { commonSubscriptionFields } from "./common";
import { Button } from "@material-ui/core";
import CancelSubscriptionButton from "../containers/CancelSubscriptionButton";

const SubscriptionFilter = props => (
  <Filter {...props}>
    <SelectInput
      label="Status"
      source="status"
      choices={subscriptionStatusChoices}
    />
    <ReferenceInput
      label="Package"
      source="packageId"
      reference="Package"
      alwaysOn
      perPage={100000}
      filter={{ onlyOriginal: true }}
    >
      <SelectInput optionText="defaultTag.name" />
    </ReferenceInput>
    <BooleanInput
      label="Payment Information Acquired"
      source="hasPaymentToken"
    />
  </Filter>
);

export const SubscriptionList = props => {
  console.log(props);
  return (
    <List
      {...props}
      perPage={25}
      sort={{ field: "createdAt", order: "DESC" }}
      filters={<SubscriptionFilter />}
      filterDefaultValues={{ status: SUBSCRIPTION_STATUS.RUNNING }}
    >
      <Datagrid rowClick="show">
        {commonSubscriptionFields}
        <CancelSubscriptionButton color="secondary" variant="contained" />
      </Datagrid>
    </List>
  );
};
