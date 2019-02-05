import React from "react";
import {
  Edit,
  SimpleForm,
  SimpleFormIterator,
  ArrayInput,
  DisabledInput,
  NumberInput,
  SelectInput,
  TextInput,
} from "react-admin";

import { LANG_CODES } from "../../constants";
import { REPEAT_CONFIG, CURRENCY } from "../../constants";

const PackageEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <div style={{ border: "1px solid black" }}>
        <div>DEFAULT TAG EKLEME YERI</div>
        <SelectInput
          source="defaultTag.code"
          choices={[
            { id: LANG_CODES.TR, name: "Turkish" },
            { id: LANG_CODES.EN, name: "English" },
          ]}
        />
        <TextInput source="defaultTag.name" />
        <TextInput source="defaultTag.description" />
      </div>
      <TextInput source="reference" />
      <SelectInput
        label="Repeat"
        source="repeatConfig"
        choices={[
          { id: REPEAT_CONFIG.NONE, name: "None" },
          { id: REPEAT_CONFIG.WEEKLY, name: "Weekly" },
          { id: REPEAT_CONFIG.MONTHLY, name: "Monthly" },
          { id: REPEAT_CONFIG.YEARLY, name: "Yearly" },
        ]}
      />
      <TextInput source="image" />
      <NumberInput source="price.amount" />
      <SelectInput
        source="price.currency"
        choices={[
          { id: CURRENCY.TRY, name: "TRY" },
          { id: CURRENCY.USD, name: "USD" },
        ]}
      />
      <NumberInput source="priority" />
      <ArrayInput source="tags">
        <SimpleFormIterator>
          <SelectInput
            source="code"
            choices={[
              { id: LANG_CODES.TR, name: "Turkish" },
              { id: LANG_CODES.EN, name: "English" },
            ]}
          />
          <TextInput source="name" />
          <TextInput source="description" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export default PackageEdit;
