import React from "react";
import { Show, SimpleShowLayout } from "react-admin";
import { commonSubscriptionFields } from "./common";

export const ChargableSubscriptionShow = props => (
  <Show {...props}>
    <SimpleShowLayout>{commonSubscriptionFields}</SimpleShowLayout>
  </Show>
);
