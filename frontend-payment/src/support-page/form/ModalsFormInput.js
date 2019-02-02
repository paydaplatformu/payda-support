import React, { useState } from "react";
import { Form, Checkbox } from "antd";

import TermsOfServiceModal from "./TermsOfServiceModal";
import ReturnPolicyModal from "./ReturnPolicyModal";

import { paydaOrange } from "../../constants";

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

  const [returnPolicyModalVisible, setreturnPolicyModalVisible] = useState(
    false,
  );

  return (
    <>
      <TermsOfServiceModal
        visible={termsOfServiceModalVisible}
        dismissModal={() => setTermsOfServiceModalVisible(false)}
      />
      <ReturnPolicyModal
        visible={returnPolicyModalVisible}
        dismissModal={() => setreturnPolicyModalVisible(false)}
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
        })(
          <>
            <Checkbox />{" "}
            <span
              style={modalLinkStyles}
              onClick={() => setTermsOfServiceModalVisible(true)}
            >
              Satis Sozlesmesi
            </span>{" "}
            ve{" "}
            <span
              style={modalLinkStyles}
              onClick={() => setreturnPolicyModalVisible(true)}
            >
              Iade Sartlari
            </span>
            'ni okudum, kabul ediyorum.
          </>,
        )}
      </Form.Item>
    </>
  );
};

export default ModalsFormInput;
