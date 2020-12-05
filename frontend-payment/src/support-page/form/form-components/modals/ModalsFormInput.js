import React, { useState, useContext } from "react";
import { Form, Checkbox } from "antd";

import { TranslationContext } from "../../../../translations";
import { paydaOrange, LANG_CODES } from "../../../../constants";

import TermsOfServiceModal from "./TermsOfServiceModal";
import ReturnPolicyModal from "./ReturnPolicyModal";

const modalLinkStyles = {
  padding: 0,
  color: paydaOrange,
  textDecoration: "underline",
  cursor: "pointer",
};

const ModalsFormInput = props => {
  const [termsOfServiceModalVisible, setTermsOfServiceModalVisible] = useState(false);

  const [returnPolicyModalVisible, setReturnPolicyModalVisible] = useState(false);

  const { translate, langCode } = useContext(TranslationContext);

  const validateCheckBox = async (rule, value, callback) => {
    if (!value) {
      throw new Error(translate("agreements_accepted_validation_error"));
    }
  };

  return (
    <>
      <TermsOfServiceModal
        visible={termsOfServiceModalVisible}
        dismissModal={() => setTermsOfServiceModalVisible(false)}
      />
      <ReturnPolicyModal visible={returnPolicyModalVisible} dismissModal={() => setReturnPolicyModalVisible(false)} />
      <Form.Item
        name="agreementsAccepted"
        valuePropName="checked"
        style={{ marginBottom: 20 }}
        rules={[
          {
            required: true,
            validator: validateCheckBox,
          },
        ]}
      >
        <Checkbox>
          <span>
            {langCode === LANG_CODES.EN ? translate("read_and_accept") : null}
            <span style={modalLinkStyles} onClick={() => setTermsOfServiceModalVisible(true)}>
              {translate("terms_and_conditions")}
            </span>
            {` ${translate("and")} `}
            <span style={modalLinkStyles} onClick={() => setReturnPolicyModalVisible(true)}>
              {translate("refund_policy")}
            </span>
            {langCode === LANG_CODES.TR ? translate("read_and_accept") : null}
          </span>
        </Checkbox>
      </Form.Item>
    </>
  );
};

export default ModalsFormInput;
