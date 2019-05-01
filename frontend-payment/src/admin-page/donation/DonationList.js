import React from "react";
import {
  Datagrid,
  Filter,
  List,
  NullableBooleanInput,
  ReferenceInput,
  SelectInput,
  TextInput
} from "react-admin";
import { commonFields } from "./common";

const DonationFilter = props => (
  <Filter {...props}>
    <TextInput label="Search" source="search" alwaysOn />
    <NullableBooleanInput label="Payment" source="paymentConfirmed" alwaysOn />
    <ReferenceInput
      label="Package"
      source="packageId"
      reference="Package"
      alwaysOn
      perPage={100000}
    >
      <SelectInput optionText="defaultTag.name" />
    </ReferenceInput>
  </Filter>
);

const DonationList = props => (
  <List
    {...props}
    perPage={25}
    sort={{ field: "date", order: "DESC" }}
    filters={<DonationFilter />}
    filterDefaultValues={{ paymentConfirmed: true }}
  >
    <Datagrid rowClick="show">{commonFields}</Datagrid>
  </List>
);

export default DonationList;
