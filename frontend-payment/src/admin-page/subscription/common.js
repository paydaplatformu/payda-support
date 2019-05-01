import React from "react";
import {
  BooleanField,
  DateField,
  ReferenceField,
  SelectField,
  TextField
} from "react-admin";
import {
  defaultDateFieldProps,
  repeatIntervalChoices,
  subscriptionStatusChoices,
  getSourceProp
} from "../../utils";

export const commonSubscriptionFields = [
  <TextField label="Id" source="id" />,
  <ReferenceField
    label="Name"
    reference="Donation"
    source="donationId"
    linkType={false}
  >
    <TextField source="fullName" />
  </ReferenceField>,
  <ReferenceField
    label="Package"
    reference="Package"
    source="packageId"
    linkType="edit"
  >
    <TextField source="defaultTag.name" />
  </ReferenceField>,
  <ReferenceField
    label="Donation"
    reference="Donation"
    source="donationId"
    linkType="show"
  >
    <TextField source="id" />
  </ReferenceField>,
  <ReferenceField
    label="Price"
    reference="Package"
    source="packageId"
    linkType={false}
  >
    <TextField source="price.amount" />
  </ReferenceField>,
  <ReferenceField
    label="Currency"
    reference="Package"
    source="packageId"
    linkType={false}
  >
    <TextField source="price.currency" />
  </ReferenceField>,
  <ReferenceField
    label="Repeat Interval"
    reference="Package"
    source="packageId"
    linkType={false}
  >
    <SelectField source="repeatInterval" choices={repeatIntervalChoices} />
  </ReferenceField>,
  <SelectField
    label="Status"
    source="status"
    choices={subscriptionStatusChoices}
  />,
  <BooleanField label="Payment Info Acquired" source="hasPaymentToken" />,
  <DateField {...defaultDateFieldProps} label="Created" source="createdAt" />,
  <DateField
    {...defaultDateFieldProps}
    label="Last Updated"
    source="updatedAt"
  />
].map(f => React.cloneElement(f, { key: getSourceProp(f) }));
