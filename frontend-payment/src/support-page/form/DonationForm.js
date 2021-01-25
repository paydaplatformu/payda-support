import React, { useContext, useEffect, useState } from "react";
import { Form, Input, InputNumber } from "antd";

import { TranslationContext } from "../../translations";
import { LANG_CODES } from "../../constants";
import { PackageContextProvider } from "./form-components/package/PackageContext";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import SubmitButton from "./form-components/SubmitButton";
import PackageSelect from "./form-components/package/PackageSelect";
import PackageCustomize from "./form-components/package/PackageCustomize";
import ModalsFormInput from "./form-components/modals/ModalsFormInput";
import { isPackageRecurrent } from "../../utils";

const DonationForm = ({ createDonation }) => {
  const [form] = Form.useForm();

  const [quantityDisabled, setQuantityDisabled] = useState(false);
  const { resetFields, setFieldsValue } = form;

  const { translate, langCode } = useContext(TranslationContext);

  useEffect(() => {
    resetFields();
  }, [langCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmitForm = data => {
    const phoneNumber = data.phoneNumber && parsePhoneNumberFromString(data.phoneNumber, "TR");
    if (phoneNumber?.isValid()) {
      createDonation({
        variables: {
          donationInput: {
            ...data,
            phoneNumber: phoneNumber.format("E.164"),
            agreementsAccepted: undefined,
          },
          language: langCode.toUpperCase(),
        },
      });
    }
  };

  const formatQuantity = value => (langCode === LANG_CODES.TR ? `${value} Adet` : `Quantity: ${value}`);

  const handleRepeatIntervalChange = repeatInterval => {
    if (isPackageRecurrent(repeatInterval)) {
      setQuantityDisabled(true);
      setFieldsValue({
        quantity: 1,
      });
    } else {
      setQuantityDisabled(false);
    }
  };

  return (
    <Form form={form} onFinish={onSubmitForm}>
      <PackageContextProvider>
        <div style={{ display: "flex" }}>
          <div style={{ width: "100%", marginRight: 10 }}>
            <PackageSelect
              onPackageSelect={pkg => {
                handleRepeatIntervalChange(pkg.recurrenceConfig.repeatInterval);
                setFieldsValue({
                  customPriceAmount: pkg && pkg.price.amount,
                  customPriceCurrency: pkg && pkg.price.currency,
                  customRepeatInterval: pkg && pkg.recurrenceConfig.repeatInterval,
                });
              }}
            />
          </div>
          <Form.Item name="quantity" initialValue={1}>
            <InputNumber
              min={1}
              size="large"
              disabled={quantityDisabled}
              style={langCode === LANG_CODES.EN ? { minWidth: 120 } : undefined}
              formatter={formatQuantity}
            />
          </Form.Item>
        </div>
        <PackageCustomize
          amountField="customPriceAmount"
          currencyField="customPriceCurrency"
          repeatIntervalField="customRepeatInterval"
          onRepeatIntervalChange={repeatInterval => {
            handleRepeatIntervalChange(repeatInterval);
          }}
        />
        <Form.Item
          validateTrigger="onBlur"
          name="fullName"
          rules={[
            {
              required: true,
              pattern: /(\w.+\s).+/i,
              message: translate("fullname_validation_error"),
            },
          ]}
        >
          <Input placeholder={translate("supporter_name")} size="large" />
        </Form.Item>
        <Form.Item
          validateTrigger="onBlur"
          name="email"
          rules={[
            {
              required: true,
              pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
              message: translate("email_validation_error"),
            },
          ]}
        >
          <Input placeholder={translate("email_address")} size="large" />
        </Form.Item>
        <Form.Item
          validateTrigger="onBlur"
          name="phoneNumber"
          rules={[
            {
              required: true,
              validator: (rule, value) => {
                const phoneNumber = parsePhoneNumberFromString(value, "TR");
                if (phoneNumber?.isValid()) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(translate("phone_number_validation_error"));
                }
              },
              message: translate("phone_number_validation_error"),
            },
          ]}
        >
          <Input placeholder={translate("phone_number")} type="tel" size="large" />
        </Form.Item>
        <Form.Item name="notes">
          <Input.TextArea placeholder={translate("notes")} size="large" rows={4} />
        </Form.Item>
        <ModalsFormInput />
        <Form.Item>
          <SubmitButton htmlType="submit" size="large" block>
            {translate("support_now")}
          </SubmitButton>
        </Form.Item>
      </PackageContextProvider>
    </Form>
  );
};

export default DonationForm;
