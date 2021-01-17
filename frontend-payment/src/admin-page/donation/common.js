import React from "react";
import { BooleanField, DateField, EmailField, ReferenceField, SelectField, TextField } from "react-admin";
import { defaultDateFieldProps, repeatIntervalChoices, getSourceProp } from "../../utils";

export const commonDonationFields = [
  <TextField source="id" />,
  <TextField source="fullName" />,
  <EmailField source="email" />,
  <ReferenceField sortable={false} reference="Package" source="packageId">
    <TextField source="defaultTag.name" />
  </ReferenceField>,
  <ReferenceField sortable={false} label="Amount" reference="Package" source="packageId" linkType={false}>
    <TextField source="price.amount" />
  </ReferenceField>,
  <ReferenceField sortable={false} label="Currency" reference="Package" source="packageId" linkType={false}>
    <TextField source="price.currency" />
  </ReferenceField>,
  <ReferenceField sortable={false} label="Repeat Interval" reference="Package" source="packageId" linkType={false}>
    <SelectField source="recurrenceConfig.repeatInterval" choices={repeatIntervalChoices} />
  </ReferenceField>,
  <ReferenceField sortable={false} label="Custom" reference="Package" source="packageId" linkType={false}>
    <BooleanField source="isCustom" />
  </ReferenceField>,
  <ReferenceField
    sortable={false}
    label="Parent"
    reference="Donation"
    source="parentDonationId"
    linkType="show"
    allowEmpty
  >
    <TextField source="id" />
  </ReferenceField>,
  <BooleanField source="paymentConfirmed" />,
  <DateField {...defaultDateFieldProps} label="Date" source="date" />,
].map(f => React.cloneElement(f, { key: getSourceProp(f) }));
