import React from "react";
import {
  Edit,
  SimpleForm,
  SimpleFormIterator,
  SelectInput,
  TextInput,
  BooleanInput,
  Toolbar,
  SaveButton,
} from "react-admin";

import {
  repeatIntervalChoices,
  currencyChoices,
  languageChoices,
} from "../../utils";

import {
  StyledTextInput,
  StyledSelectInput,
  StyledNumberInput,
  StyledArrayInput,
  StyledDivider,
} from "./PackageFormComponents";

const PackageEditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
);

const PackageEdit = (props) => (
  <Edit undoable={false} {...props}>
    <SimpleForm toolbar={<PackageEditToolbar />}>
      <h2>Package Information</h2>
      <StyledDivider />
      <StyledSelectInput
        source="defaultTag.code"
        label="Default Package Language"
        choices={languageChoices}
      />
      <StyledTextInput source="defaultTag.name" label="Default Package Name" />
      <StyledTextInput
        multiline
        source="defaultTag.description"
        label="Default Package Description"
      />
      <h4 style={{ marginTop: 30, width: "50%" }}>
        * You can add package information in other languages by clicking the
        button below
      </h4>
      <StyledArrayInput source="tags" label="">
        <SimpleFormIterator style={{ marginTop: 30 }}>
          <SelectInput
            source="code"
            label="Language"
            choices={languageChoices}
          />
          <TextInput source="name" label="Name" />
          <TextInput multiline source="description" label="Description" />
        </SimpleFormIterator>
      </StyledArrayInput>
      <h2 style={{ marginTop: 30 }}>Price Information</h2>
      <StyledDivider />
      <StyledTextInput
        disabled
        source="price.currency"
        label="Currency"
        choices={currencyChoices}
      />
      <StyledTextInput disabled source="price.amount" label="Price" />
      <StyledTextInput
        disabled
        source="repeatInterval"
        label="Repetitive Payment Interval"
        choices={repeatIntervalChoices}
      />
      <BooleanInput
        source="customizationConfig.allowPriceAmountCustomization"
        label="Customizable Price"
        defaultValue={false}
      />
      <BooleanInput
        source="customizationConfig.allowPriceCurrencyCustomization"
        label="Customizable Currency"
        defaultValue={false}
      />
      <BooleanInput
        source="customizationConfig.allowRepeatIntervalCustomization"
        label="Customizable Interval"
        defaultValue={false}
      />
      <h2 style={{ marginTop: 30 }}>Package Image</h2>
      <StyledDivider />
      <StyledTextInput source="image" label="Image URL" />
      <h2 style={{ marginTop: 30 }}>Other Information</h2>
      <StyledDivider />
      <StyledTextInput source="reference" />
      <StyledNumberInput source="priority" />
      <BooleanInput source="isActive" label="Accept Donations" />
    </SimpleForm>
  </Edit>
);

export default PackageEdit;
