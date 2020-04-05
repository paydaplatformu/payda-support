import React from "react";
import {
  Datagrid,
  Filter,
  List,
  ReferenceInput,
  SelectInput
} from "react-admin";
import { REPEAT_INTERVAL } from "../../constants";
import { activeRepeatIntervalChoices } from "../../utils";
import ChargeSubscriptionButton from "../containers/ChargeSubscriptionButton";
import { commonChargableSubscriptionFields } from "./common";

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
    bulkActionButtons={false}
    filters={<ChargableSubscriptionFilter />}
  >
    <Datagrid rowClick="show">
      {commonChargableSubscriptionFields}
      <ChargeSubscriptionButton color="secondary" variant="contained" />
    </Datagrid>
  </List>
);
