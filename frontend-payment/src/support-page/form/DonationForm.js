import React, { useContext } from "react";
import { Form, Input, InputNumber, Checkbox } from "antd";

import { TranslationContext } from "../../translations";

import SubmitButton from "./form-components/SubmitButton";
import PackageSelect from "./form-components/PackageSelect";
import ModalsFormInput from "./form-components/modals/ModalsFormInput";

const DonationFormInner = props => {
  const {
    createDonation,
    form: { validateFields, getFieldDecorator },
  } = props;

  const { translate } = useContext(TranslationContext);

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
      <Form.Item label="Adet" style={{ display: "flex" }}>
        {getFieldDecorator("quantity", { initialValue: 1 })(
          <InputNumber min={1} size="large" />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("fullName", {
          rules: [
            {
              required: true,
              message: translate("fullname_required_error"),
            },
          ],
        })(<Input placeholder="Destekleyen Kisi" size="large" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("email", {
          rules: [
            {
              required: true,
              message: "Lutfen e-posta adresinizi giriniz",
            },
          ],
        })(<Input placeholder="E-posta Adresi" size="large" />)}
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        {getFieldDecorator("usingAmex", {
          valuePropName: "checked",
          initialValue: false,
        })(<Checkbox>Odememi American Express kullanarak yapacagim</Checkbox>)}
      </Form.Item>
      <ModalsFormInput getFieldDecorator={getFieldDecorator} />
      <Form.Item>
        <SubmitButton htmlType="submit" size="large" block>
          Destek Ol!
        </SubmitButton>
      </Form.Item>
    </Form>
  );
};

export default Form.create({ name: "donate" })(DonationFormInner);
