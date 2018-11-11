import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class UserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: 1,
      name: '',
      email: '',
      description: ''
    };
  }

  handleChange = fieldName => event =>
    this.setState({ [fieldName]: event.target.value });

  handleClick = () => {
    console.log(this.state);
  };

  render() {
    return (
      <div>
        <TextField
          id="quantity"
          label="Adet"
          // className={classes.textField}
          value={this.state.quantity}
          type="number"
          onChange={this.handleChange('quantity')}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          id="outlined-name"
          label="Destekleyen Kisi"
          // className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange('name')}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          id="email"
          label="E-posta Adresi"
          // className={classes.textField}
          value={this.state.email}
          type="email"
          onChange={this.handleChange('email')}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          id="description"
          label="Aciklama"
          // className={classes.textField}
          value={this.state.description}
          onChange={this.handleChange('description')}
          margin="normal"
          variant="outlined"
          multiline
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleClick}
          fullWidth
        >
          Destek Ol!
        </Button>
      </div>
    );
  }
}

export default UserForm;
