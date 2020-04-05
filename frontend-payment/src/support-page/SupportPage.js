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

const StyledPaymentChannelsContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 3px;
  margin: 20px 0;
`;

const SupportPage = () => (
  <>
    <GlobalStyle />
    <LanguageButtons />
    <Row>
      <Col xs={24} md={{ span: 14, offset: 5 }}>
        <StyledFormContainer>
          <Title />
          <DonationFormWithGql />
        </StyledFormContainer>
        <StyledPaymentChannelsContainer>
          <h4>PAYLAŞMA VE DAYANIŞMA PLATFORMU DERNEĞİ</h4>
          <h4>AKBANK Akmerkez Şubesi</h4>
          <div>
            <b>TL: </b>TR 11 0004 6007 6888 8000 0446 71
          </div>
          <div>
            <b>EUR: </b>TR 52 0004 6007 6803 6000 0922 04
          </div>
          <div>
            <b>USD: </b>TR 55 0004 6007 6800 1000 0465 86
          </div>
          <div>
            <b>SWIFT Kodu: </b>AKBKTRİS
          </div>
        </StyledPaymentChannelsContainer>
      </Col>
    </Row>
  </>
);

export default SupportPage;
