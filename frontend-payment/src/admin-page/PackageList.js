import React from "react";
import {
  List,
  Datagrid,
  Filter,
  BooleanInput,
  TextField,
  DateField,
  NumberField,
  BooleanField,
} from "react-admin";

const PackageFilter = props => (
  <Filter {...props}>
    <BooleanInput source="onlyActive" alwaysOn />
  </Filter>
);

export const PackageList = props => (
  <List {...props} filters={<PackageFilter />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="reference" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <NumberField source="priority" />
      <BooleanField source="isActive" />
    </Datagrid>
  </List>
);
