import React from "react";
import {
  Datagrid,
  Filter,
  List,
  ReferenceInput,
  SelectInput,
  TextField
} from "react-admin";
import { REPEAT_INTERVAL } from "../../constants";
import { activeRepeatIntervalChoices } from "../../utils";

const ChargableSubscriptionFilter = props => (
  <Filter {...props}>
    <SelectInput
      allowEmpty={false}
      label="Repeat Interval"
      source="repeatInterval"
      choices={activeRepeatIntervalChoices}
      alwaysOn
    />
    <ReferenceInput
      label="Package"
      source="packageId"
      reference="Package"
      alwaysOn
      perPage={100000}
    >
      <SelectInput optionText="defaultTag.name" />
    </ReferenceInput>
  </Filter>
);

export const ChargableSubscriptionList = props => (
  <List
    {...props}
    filterDefaultValues={{ repeatInterval: REPEAT_INTERVAL.MONTHLY }}
    perPage={25}
    style={{ marginBottom: "2rem" }}
    sort={{ field: "createdAt", order: "DESC" }}
    filters={<ChargableSubscriptionFilter />}
  >
    <Datagrid rowClick="show">
      <TextField label="Id" source="id" />
    </Datagrid>
  </List>
);
