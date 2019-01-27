import React from "react";
import { withStyles } from "@material-ui/core/styles";

import MuiTextField from "@material-ui/core/TextField";

import { paydaOrange } from "../constants";

const styles = theme => ({
  cssLabel: {
    "&$cssFocused": {
      color: paydaOrange,
    },
  },
  cssFocused: {},
  cssUnderline: {
    "&:after": {
      borderBottomColor: paydaOrange,
    },
  },
  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: paydaOrange,
    },
  },
  notchedOutline: {},
});

const TextField = props => (
  <MuiTextField
    id="custom-css-outlined-input"
    InputLabelProps={{
      classes: {
        root: props.classes.cssLabel,
        focused: props.classes.cssFocused,
      },
    }}
    InputProps={{
      classes: {
        root: props.classes.cssOutlinedInput,
        focused: props.classes.cssFocused,
        notchedOutline: props.classes.notchedOutline,
      },
    }}
    variant="outlined"
    fullWidth
    margin="normal"
    {...props}
  />
);

export default withStyles(styles)(TextField);
