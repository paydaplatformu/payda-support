import "antd/dist/antd.css";

import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Row, Col } from "antd";

import { paydaOrange } from "../constants";

import Title from "./Title";
import DonationFormWithGql from "./form/DonationFormWithGql";
import LanguageButtons from "./LanguageButtons";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${paydaOrange};
  }

  .ant-spin-dot > i {
    background-color: ${paydaOrange};
  }

  .ant-spin-text {
    color: ${paydaOrange};
    font-size: 16px;
    margin-top: 20px;
  }
`;

const StyledFormContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 3px;
  margin: 20px 0;
`;

const SupportPage = () => (
  <>
    <GlobalStyle />
    <Row>
      <Col xs={24} md={{ span: 14, offset: 5 }}>
        <StyledFormContainer>
          <Title />
          <DonationFormWithGql />
        </StyledFormContainer>
        <LanguageButtons />
      </Col>
    </Row>
  </>
);

export default SupportPage;
