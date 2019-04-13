import React from "react";
import {
  Edit,
  SimpleForm,
  SimpleFormIterator,
  ArrayInput,
  DisabledInput,
  NumberInput,
  SelectInput,
  TextInput
} from "react-admin";

import { LANG_CODES } from "../../constants";
import { repeatConfigChoices, currencyChoices } from "../../utils";

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
            { id: LANG_CODES.EN, name: "English" }
          ]}
        />
        <TextInput source="defaultTag.name" />
        <TextInput source="defaultTag.description" />
      </div>
      <TextInput source="reference" />
      <SelectInput
        label="Repeat"
        source="repeatConfig"
        choices={repeatConfigChoices}
      />
      <TextInput source="image" />
      <NumberInput source="price.amount" />
      <SelectInput source="price.currency" choices={currencyChoices} />
      <NumberInput source="priority" />
      <ArrayInput source="tags">
        <SimpleFormIterator>
          <SelectInput
            source="code"
            choices={[
              { id: LANG_CODES.TR, name: "Turkish" },
              { id: LANG_CODES.EN, name: "English" }
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
