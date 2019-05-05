import React from "react";
import { Show, SimpleShowLayout } from "react-admin";
import { commonChargableSubscriptionFields } from "./common";

export const ChargableSubscriptionShow = props => (
  <Show {...props}>
    <SimpleShowLayout>{commonChargableSubscriptionFields}</SimpleShowLayout>
  </Show>
);
