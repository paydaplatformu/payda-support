import React, { useContext, useEffect } from "react";
import { Form, Input, InputNumber, Checkbox } from "antd";

import { TranslationContext } from "../../translations";

import SubmitButton from "./form-components/SubmitButton";
import PackageSelect from "./form-components/PackageSelect";
import ModalsFormInput from "./form-components/modals/ModalsFormInput";

const DonationFormInner = props => {
  const {
    createDonation,
    form: {
      validateFields,
      getFieldDecorator,
      setFields,
      resetFields,
      ...rest
    },
  } = props;

  const { translate, langCode } = useContext(TranslationContext);

  useEffect(() => {
    resetFields();
  }, [langCode]);

  const onSubmitForm = e => {
    e.preventDefault();

    validateFields((err, fieldValues) => {
      if (err) return;

      createDonation({
        variables: {
          donationCreator: { ...fieldValues, agreementsAccepted: undefined },
          language: "TR",
        },
      });
    });
  };

  return (
    <Form onSubmit={onSubmitForm}>
      <PackageSelect getFieldDecorator={getFieldDecorator} />
      <Form.Item label={translate("quantity")} style={{ display: "flex" }}>
        {getFieldDecorator("quantity", { initialValue: 1 })(
          <InputNumber min={1} size="large" />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("fullName", {
          rules: [
            {
              required: true,
              pattern: /(\w.+\s).+/i,
              message: translate("fullname_validation_error"),
            },
          ],
          validateTrigger: "onBlur",
        })(<Input placeholder={translate("supporter_name")} size="large" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("email", {
          rules: [
            {
              required: true,
              pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
              message: translate("email_validation_error"),
            },
          ],
          validateTrigger: "onBlur",
        })(<Input placeholder={translate("email_address")} size="large" />)}
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        {getFieldDecorator("usingAmex", {
          valuePropName: "checked",
          initialValue: false,
        })(<Checkbox>{translate("pay_using_amex")}</Checkbox>)}
      </Form.Item>
      <ModalsFormInput getFieldDecorator={getFieldDecorator} />
      <Form.Item>
        <SubmitButton htmlType="submit" size="large" block>
          {translate("support_now")}
        </SubmitButton>
      </Form.Item>
    </Form>
  );
};

export default Form.create({ name: "donate" })(DonationFormInner);
