import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ArrayField,
  Datagrid,
  BooleanField,
  DateField,
  FunctionField
} from "react-admin";
import { commonSubscriptionFields } from "./common";
import { defaultDateFieldProps } from "../../utils";

export const SubscriptionShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      {commonSubscriptionFields}
      <TextField label="Deactivation Reason" source="deactivaionReason" />
      <ArrayField source="processHistory">
        <Datagrid>
          <DateField {...defaultDateFieldProps} label="Date" source="date" />
          <BooleanField label="Succesful" source="isSuccess" />
          <FunctionField
            label="Result"
            source="result"
            render={record => JSON.stringify(record.result)}
          />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
