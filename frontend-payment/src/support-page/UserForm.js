import React, { Component } from "react";
import styled from "styled-components";

import TextField from "../components/TextField";
import Button from "../components/Button";

const StyledUserFormContainer = styled.div`
  @media (max-width: 768px) {
    margin: 30px 20px;
  }
`;

class UserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: 1,
      name: "",
      email: "",
      description: "",
    };
  }

  handleChange = fieldName => event =>
    this.setState({ [fieldName]: event.target.value });

  handleClick = () => {
    console.log(this.state);
  };

  render() {
    return (
      <StyledUserFormContainer>
        <TextField
          id="outlined-name"
          label="Destekleyen Kisi"
          value={this.state.name}
          onChange={this.handleChange("name")}
        />
        <TextField
          id="email"
          label="E-posta Adresi"
          value={this.state.email}
          type="email"
          onChange={this.handleChange("email")}
        />
        <TextField
          id="description"
          label="Aciklama"
          value={this.state.description}
          onChange={this.handleChange("description")}
          multiline
        />
        <Button onClick={this.handleClick}>Destek Ol!</Button>
      </StyledUserFormContainer>
    );
  }
}

export default UserForm;
