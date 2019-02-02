import React, { Component } from "react";

class PayUForm extends Component {
  componentDidMount() {
    document.forms["payu-form"].submit();
  }

  render() {
    return (
      <form method="post" action={this.props.formUrl} id="payu-form">
        {this.props.formFields.map(({ key, value }) => (
          <input name={key} value={value} type="hidden" />
        ))}
      </form>
    );
  }
}

export default PayUForm;
