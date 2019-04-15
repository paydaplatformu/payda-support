import React, { useContext } from "react";
import { Form, Select, InputNumber } from "antd";

import { PackageContext } from "./PackageContext";
import { TranslationContext } from "../../../../translations";
import { REPEAT_INTERVAL_TRANSLATION_KEYS } from "../../../../constants";

const styles = {
  customPriceContainer: {
    display: "flex"
  },
  customPriceAmountFormItem: {
    width: "35%",
    marginRight: 10
  },
  customPriceCurrencyFormItem: {
    width: "30%",
    marginRight: 10
  },
  customRepeatIntervalFormItem: {
    width: "35%"
  }
};

const createCustomizationChecker = key => pkg =>
  !!(pkg && pkg.customizationConfig[key]);

const isPriceAmountCustomizable = createCustomizationChecker(
  "allowPriceAmountCustomization"
);

const isPriceCurrencyCustomizable = createCustomizationChecker(
  "allowPriceCurrencyCustomization"
);

const isRepeatIntervalCustomizable = createCustomizationChecker(
  "allowRepeatIntervalCustomization"
);

const PackageCustomize = ({
  getFieldDecorator,
  amountField,
  currencyField,
  repeatIntervalField
}) => {
  const {
    loading,
    selectedPackage,
    availableCurrencies,
    availableRepeatIntervals
  } = useContext(PackageContext);

  const { translate } = useContext(TranslationContext);
  return !loading ? (
    <div style={styles.customPriceContainer}>
      <Form.Item style={styles.customPriceAmountFormItem}>
        {getFieldDecorator(amountField)(
          <InputNumber
            size="large"
            min={1}
            step={1}
            disabled={!isPriceAmountCustomizable(selectedPackage)}
            placeholder={translate("custom_amount_placeholder")}
            style={{ width: "100%" }}
          />
        )}
      </Form.Item>
      <Form.Item style={styles.customPriceCurrencyFormItem}>
        {getFieldDecorator(currencyField)(
          <Select
            size="large"
            disabled={!isPriceCurrencyCustomizable(selectedPackage)}
            style={{ width: "100%" }}
            placeholder={translate("custom_currency_placeholder")}
          >
            {availableCurrencies.map(currency => (
              <Select.Option key={currency} value={currency} disabled={loading}>
                {currency}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item style={styles.customRepeatIntervalFormItem}>
        {getFieldDecorator(repeatIntervalField)(
          <Select
            size="large"
            disabled={!isRepeatIntervalCustomizable(selectedPackage)}
            style={{ width: "100%" }}
            placeholder={translate("custom_repeat_interval_placeholder")}
          >
            {availableRepeatIntervals.map(repeatInterval => (
              <Select.Option
                key={repeatInterval}
                value={repeatInterval}
                disabled={loading}
              >
                {translate(REPEAT_INTERVAL_TRANSLATION_KEYS[repeatInterval]) ||
                  repeatInterval}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </div>
  ) : null;
};

export default PackageCustomize;
