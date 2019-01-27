import React from "react";
import {
  List,
  Datagrid,
  Filter,
  BooleanInput,
  ArrayField,
  BooleanField,
  ChipField,
  DateField,
  NumberField,
  ReferenceArrayField,
  SingleFieldList,
  TextField,
} from "react-admin";

const PackageFilter = props => (
  <Filter {...props}>
    <BooleanInput source="onlyActive" alwaysOn />
  </Filter>
);

const PackageList = props => (
  <List {...props} filters={<PackageFilter />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="reference" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="defaultTag.code" />
      <TextField label="Repeat Interval" source="repeatConfig" />
      <NumberField source="donationCount" />
      <TextField label="Currency" source="price.currency" />
      <NumberField source="priority" />
      <BooleanField source="isActive" />
    </Datagrid>
  </List>
);

export default PackageList;
