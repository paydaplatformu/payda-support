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
  const [termsOfServiceModalVisible, setTermsOfServiceModalVisible] = useState(
    false,
  );

  const [returnPolicyModalVisible, setReturnPolicyModalVisible] = useState(
    false,
  );

  const { translate, langCode } = useContext(TranslationContext);

  return (
    <>
      <TermsOfServiceModal
        visible={termsOfServiceModalVisible}
        dismissModal={() => setTermsOfServiceModalVisible(false)}
      />
      <ReturnPolicyModal
        visible={returnPolicyModalVisible}
        dismissModal={() => setReturnPolicyModalVisible(false)}
      />
      <Form.Item style={{ marginBottom: 40 }}>
        {props.getFieldDecorator("agreementsAccepted", {
          valuePropName: "checked",
          rules: [
            {
              required: true,
              message: "Bu secenegin secilmesi zorunludur",
            },
          ],
        })(<Checkbox />)}
        <span>
          {langCode === LANG_CODES.EN ? translate("read_and_accept") : null}
          <span
            style={modalLinkStyles}
            onClick={() => setTermsOfServiceModalVisible(true)}
          >
            {translate("terms_and_conditions")}
          </span>
          {` ${translate("and")} `}
          <span
            style={modalLinkStyles}
            onClick={() => setReturnPolicyModalVisible(true)}
          >
            {translate("refund_policy")}
          </span>
          {langCode === LANG_CODES.TR ? translate("read_and_accept") : null}
        </span>
      </Form.Item>
    </>
  );
};

export default ModalsFormInput;
