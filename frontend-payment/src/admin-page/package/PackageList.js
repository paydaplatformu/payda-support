import React from "react";
import {
  BooleanField,
  BooleanInput,
  Datagrid,
  DateField,
  Filter,
  List,
  NumberField,
  NumberInput,
  SelectField,
  SelectInput,
  TextField,
  TextInput
} from "react-admin";
import {
  currencyChoices,
  defaultDateFieldProps,
  repeatIntervalChoices
} from "../../utils";

const PackageFilter = props => (
  <Filter {...props}>
    <BooleanInput label="Only Active" source="onlyActive" alwaysOn />
    <TextInput label="Search" source="search" alwaysOn />
    <SelectInput
      label="Repeat Interval"
      source="repeatInterval"
      choices={repeatIntervalChoices}
    />
    <NumberInput label="Amount" source="amount" />
    <SelectInput label="Currency" source="currency" choices={currencyChoices} />
    <BooleanInput label="Show Custom" source="showCustom" />
  </Filter>
);

const PackageList = props => (
  <List
    {...props}
    perPage={25}
    sort={{ field: "priority", order: "DESC" }}
    filters={<PackageFilter />}
    filterDefaultValues={{ onlyActive: true, showCustom: false }}
  >
    <Datagrid rowClick="edit">
      <TextField label="Id" source="id" />
      <TextField label="Ref" source="reference" />
      <NumberField source="priority" />
      <TextField label="Name" source="defaultTag.name" />
      <NumberField label="Donations" source="donationCount" />
      <SelectField
        label="Repeat Interval"
        source="repeatInterval"
        choices={repeatIntervalChoices}
      />
      <TextField label="Price" source="price.amount" />
      <TextField label="Currency" source="price.currency" />
      <DateField
        {...defaultDateFieldProps}
        label="Created"
        source="createdAt"
      />
      <DateField
        {...defaultDateFieldProps}
        label="Last Updated"
        source="updatedAt"
      />
      <BooleanField label="Custom" source="isCustom" />
      <BooleanField label="Active" source="isActive" />
    </Datagrid>
  </List>
);

export default PackageList;
