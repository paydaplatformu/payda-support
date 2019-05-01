import React from "react";
import { RichTextField, Show, SimpleShowLayout } from "react-admin";
import { commonFields } from "./common";

export const DonationShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      {commonFields}
      <RichTextField source="notes" />
    </SimpleShowLayout>
  </Show>
);
