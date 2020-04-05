import React from "react";
import {
  Datagrid,
  Filter,
  List,
  NullableBooleanInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  TextInput
} from "react-admin";
import { commonDonationFields } from "./common";

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
    <BooleanInput label="Only Direct" source="onlyDirect" />
  </Filter>
);

const DonationList = props => (
  <List
    {...props}
    perPage={25}
    sort={{ field: "date", order: "DESC" }}
    filters={<DonationFilter />}
    filterDefaultValues={{ paymentConfirmed: true }}
    bulkActionButtons={false}
  >
    <Datagrid rowClick="show">{commonDonationFields}</Datagrid>
  </List>
);

export default DonationList;
