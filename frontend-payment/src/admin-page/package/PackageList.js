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
  repeatConfigChoices
} from "../../utils";

const PackageFilter = props => (
  <Filter {...props}>
    <BooleanInput label="Only Active" source="onlyActive" alwaysOn />
    <BooleanInput label="Show Custom" source="isCustom" />
    <TextInput label="Id" source="id" />
    <TextInput label="Ref" source="reference" />
    <TextInput label="Name" source="name" />
    <NumberInput label="Price" source="price.amount" />
    <SelectInput
      label="Currency"
      source="price.currency"
      choices={currencyChoices}
    />
  </Filter>
);

const PackageList = props => (
  <List
    {...props}
    perPage={25}
    sort={{ field: "priority", order: "DESC" }}
    filters={<PackageFilter />}
    filterDefaultValues={{ onlyActive: true, isCustom: false }}
  >
    <Datagrid rowClick="edit">
      <TextField label="Id" source="id" />
      <TextField label="Ref" source="reference" />
      <NumberField source="priority" />
      <TextField label="Name" source="defaultTag.name" />
      <NumberField label="Donations" source="donationCount" />
      <SelectField
        label="Repeat Interval"
        source="repeatConfig"
        choices={repeatConfigChoices}
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
      <BooleanField label="Customizable" source="isCustomizable" />
      <BooleanField label="Custom" source="isCustomizable" />
      <BooleanField label="Active" source="isActive" />
    </Datagrid>
  </List>
);

export default PackageList;
