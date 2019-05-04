import React from "react";
import {
  ArrayInput,
  NumberInput,
  SelectInput,
  TextInput,
  LongTextInput,
  DisabledInput,
} from "react-admin";

const inputStyles = {
  width: "50%",
  margin: "10px 0",
};

export const StyledTextInput = props => (
  <TextInput style={inputStyles} {...props} />
);

export const StyledLongTextInput = props => (
  <LongTextInput style={inputStyles} {...props} />
);

export const StyledSelectInput = props => (
  <SelectInput style={inputStyles} {...props} />
);

export const StyledNumberInput = props => (
  <NumberInput
    style={{ ...inputStyles, "&>label": { paddingBottom: 20 } }}
    {...props}
  />
);

export const StyledArrayInput = props => (
  <ArrayInput style={inputStyles} {...props} />
);

export const StyledDisabledInput = props => (
  <DisabledInput style={inputStyles} {...props} />
);

export const StyledDivider = () => <hr style={{ marginInlineStart: 0 }} />;
