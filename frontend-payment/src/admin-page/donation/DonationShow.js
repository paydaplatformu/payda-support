import React from "react";
import { RichTextField, Show, SimpleShowLayout } from "react-admin";
import { commonDonationFields } from "./common";

export const DonationShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      {commonDonationFields}
      <RichTextField source="notes" />
    </SimpleShowLayout>
  </Show>
);
