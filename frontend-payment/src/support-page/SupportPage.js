import "antd/dist/antd.css";

import React from "react";
import styled, { createGlobalStyle } from "styled-components";

import { Row, Col } from "antd";

import { paydaOrange } from "../constants";

import AntForm from "./form/DonationForm";

import Title from "./Title";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${paydaOrange};
  }
`;

const StyledFormContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 3px;
`;

const SupportPage = () => (
  <>
    <GlobalStyle />
    <Row>
      <Col xs={24} md={{ span: 12, offset: 6 }}>
        <Title />
        <StyledFormContainer>
          <AntForm />
        </StyledFormContainer>
      </Col>
    </Row>
  </>
);

export default SupportPage;
