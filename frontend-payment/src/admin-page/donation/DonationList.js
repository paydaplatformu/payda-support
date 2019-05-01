import React from "react";
import {
  BooleanField,
  Datagrid,
  DateField,
  EmailField,
  Filter,
  List,
  NullableBooleanInput,
  ReferenceField,
  ReferenceInput,
  SelectField,
  TextField,
  TextInput,
  SelectInput
} from "react-admin";
import { defaultDateFieldProps, repeatIntervalChoices } from "../../utils";

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
    <Datagrid>
      <TextField source="id" />
      <TextField source="fullName" />
      <EmailField source="email" />
      <ReferenceField sortable={false} reference="Package" source="packageId">
        <TextField source="defaultTag.name" />
      </ReferenceField>
      <ReferenceField
        sortable={false}
        label="Amonut"
        reference="Package"
        source="packageId"
        linkType={false}
      >
        <TextField source="price.amount" />
      </ReferenceField>
      <ReferenceField
        sortable={false}
        label="Currency"
        reference="Package"
        source="packageId"
        linkType={false}
      >
        <TextField source="price.currency" />
      </ReferenceField>
      <ReferenceField
        sortable={false}
        label="Repeat Interval"
        reference="Package"
        source="packageId"
        linkType={false}
      >
        <SelectField source="repeatInterval" choices={repeatIntervalChoices} />
      </ReferenceField>
      <ReferenceField
        sortable={false}
        label="Custom"
        reference="Package"
        source="packageId"
        linkType={false}
      >
        <BooleanField source="isCustom" />
      </ReferenceField>
      <BooleanField source="paymentConfirmed" />
      <DateField {...defaultDateFieldProps} label="Date" source="date" />
    </Datagrid>
  </List>
);

export default DonationList;
