import React from "react";
import { Show, SimpleShowLayout, TextField } from "react-admin";
import { commonChargableSubscriptionFields } from "./common";

export const ChargableSubscriptionShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      {commonChargableSubscriptionFields}
      <TextField label="Deactivation Reason" source="deactivaionReason" />
    </SimpleShowLayout>
  </Show>
);
