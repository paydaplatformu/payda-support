import React from "react";
import {
  List,
  Filter,
  Datagrid,
  Pagination,
  BooleanField,
  DateField,
  EmailField,
  ReferenceField,
  TextField,
  NullableBooleanInput,
  TextInput,
} from "react-admin";

const DonationPagination = props => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />
);

const DonationFilter = props => (
  <Filter {...props}>
    <TextInput source="fullName" alwaysOn />
    <TextInput source="email" alwaysOn />
    <NullableBooleanInput label="Payment" source="paymentConfirmed" alwaysOn />
  </Filter>
);

const DonationList = props => (
  <List
    {...props}
    pagination={<DonationPagination />}
    filters={<DonationFilter />}
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="fullName" />
      <EmailField source="email" />
      <ReferenceField reference="Package" source="packageId">
        <TextField source="defaultTag.name" />
      </ReferenceField>
      <BooleanField source="paymentConfirmed" />
      <DateField source="date" />
    </Datagrid>
  </List>
);

export default DonationList;
