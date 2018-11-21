import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MuiButton from '@material-ui/core/Button';

import { paydaOrange } from './constants';

const styles = {
  root: {
    backgroundColor: paydaOrange
  },
  label: {
    fontSize: 16,
    color: '#ffffff'
  }
};

const Button = props => (
  <MuiButton
    classes={{
      root: props.classes.root,
      label: props.classes.label
    }}
    variant="contained"
    onClick={props.onClick}
    fullWidth
    disableRipple
  >
    Destek Ol!
  </MuiButton>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default withStyles(styles)(Button);
