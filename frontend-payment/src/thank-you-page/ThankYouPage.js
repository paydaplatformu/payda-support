import "antd/dist/antd.css";

import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Row, Col } from "antd";

import { paydaOrange } from "../constants";

import LanguageButtons from "../support-page/LanguageButtons";
import ThankYouMessage from "./ThankYouMessage";

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

  .ant-collapse .ant-collapse-item-disabled > .ant-collapse-header, .ant-collapse .ant-collapse-item-disabled > .ant-collapse-header > .arrow {
    color: rgba(0,0,0,0.85);
    margin-left: 28px;
  }
`;

const StyledFormContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 3px;
  margin: 20px 0;
`;

const ThankYouPage = () => (
  <>
    <GlobalStyle />
    <Row>
      <Col xs={24} md={{ span: 14, offset: 5 }}>
        <StyledFormContainer>
          <ThankYouMessage />
        </StyledFormContainer>
        <LanguageButtons />
      </Col>
    </Row>
  </>
);

export default ThankYouPage;
