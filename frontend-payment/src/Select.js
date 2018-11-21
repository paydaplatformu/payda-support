import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';

import MuiFormControl from '@material-ui/core/FormControl';
import MuiInputLabel from '@material-ui/core/InputLabel';
import MuiSelect from '@material-ui/core/Select';
import MuiOutlinedInput from '@material-ui/core/OutlinedInput';

import { paydaOrange } from './constants';

class Select extends Component {
  constructor(props) {
    super(props);

    this.state = {
      labelWidth: 0
    };
  }

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <MuiFormControl variant="outlined" margin="normal">
        <MuiInputLabel
          classes={{
            root: this.props.classes.cssLabel,
            focused: this.props.classes.cssFocused
          }}
          ref={ref => {
            this.InputLabelRef = ref;
          }}
          htmlFor="donation-package"
        >
          Bağış paketi seçiniz
        </MuiInputLabel>
        <MuiSelect
          onChange={this.props.onSelect}
          input={
            <MuiOutlinedInput
              labelWidth={this.state.labelWidth}
              classes={{
                root: classes.cssOutlinedInput,
                focused: classes.cssFocused,
                notchedOutline: classes.notchedOutline
              }}
              id="donation-package"
            />
          }
          value={this.props.value}
        >
          {this.props.children}
        </MuiSelect>
      </MuiFormControl>
    );
  }
}

const styles = {
  cssLabel: {
    '&$cssFocused': {
      color: paydaOrange
    }
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: paydaOrange
    }
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: paydaOrange
    }
  },
  notchedOutline: {}
};

export default withStyles(styles)(Select);
