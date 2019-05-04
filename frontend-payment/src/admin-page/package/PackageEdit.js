import React from "react";
import {
  Edit,
  SimpleForm,
  SimpleFormIterator,
  SelectInput,
  TextInput,
  LongTextInput,
  BooleanInput,
} from "react-admin";

import {
  repeatIntervalChoices,
  currencyChoices,
  languageChoices,
} from "../../utils";

import {
  StyledTextInput,
  StyledLongTextInput,
  StyledSelectInput,
  StyledNumberInput,
  StyledArrayInput,
  StyledDisabledInput,
  StyledDivider,
} from "./PackageFormComponents";

const PackageEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <h2>Package Information</h2>
      <StyledDivider />
      <StyledSelectInput
        source="defaultTag.code"
        label="Default Package Language"
        choices={languageChoices}
      />
      <StyledTextInput source="defaultTag.name" label="Default Package Name" />
      <StyledLongTextInput
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
          <LongTextInput source="description" label="Description" />
        </SimpleFormIterator>
      </StyledArrayInput>
      <h2 style={{ marginTop: 30 }}>Price Information</h2>
      <StyledDivider />
      <StyledDisabledInput
        source="price.currency"
        label="Currency"
        choices={currencyChoices}
      />
      <StyledDisabledInput source="price.amount" label="Price" />
      <StyledDisabledInput
        source="repeatInterval"
        label="Repetitive Payment Interval"
        choices={repeatIntervalChoices}
      />
      <BooleanInput
        source="customizationConfig.allowPriceAmountCustomization"
        label="Customizable Price"
      />
      <BooleanInput
        source="customizationConfig.allowPriceCurrencyCustomization"
        label="Customizable Currency"
      />
      <BooleanInput
        source="customizationConfig.allowRepeatIntervalCustomization"
        label="Customizable Interval"
      />
      <h2 style={{ marginTop: 30 }}>Package Image</h2>
      <StyledDivider />
      <StyledTextInput source="image" label="Image URL" />
      <h2 style={{ marginTop: 30 }}>Other Information</h2>
      <StyledDivider />
      <StyledTextInput source="reference" />
      <StyledNumberInput source="priority" />
    </SimpleForm>
  </Edit>
);

export default PackageEdit;
