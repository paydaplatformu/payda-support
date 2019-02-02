import React from "react";
import { Button } from "antd";

import { paydaOrange } from "../../constants";

const style = {
  backgroundColor: paydaOrange,
  borderColor: paydaOrange,
  color: "#fff",
  "&:hover, &:active, &:focus": {
    borderColor: paydaOrange,
    color: paydaOrange,
  },
};

const SubmitButton = props => <Button {...props} style={style} />;

export default SubmitButton;
