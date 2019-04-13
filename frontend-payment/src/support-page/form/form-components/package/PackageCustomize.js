import React, { useContext } from "react";
import { Form, Select, InputNumber } from "antd";

import { PackageContext } from "./PackageContext";
import { TranslationContext } from "../../../../translations";

const styles = {
  customPriceContainer: {
    display: "flex",
  },
  customPriceAmountFormItem: {
    width: "60%",
    marginRight: 10,
  },
  customPriceCurrencyFormItem: {
    width: "40%",
  },
};

const PackageCustomize = props => {
  const { loading, selectedPackage, availableCurrencies } = useContext(
    PackageContext,
  );

  const { translate } = useContext(TranslationContext);

  return !loading && selectedPackage.isCustomizable ? (
    <div style={styles.customPriceContainer}>
      <Form.Item style={styles.customPriceAmountFormItem}>
        {props.getFieldDecorator("customPrice.amount")(
          <InputNumber
            size="large"
            min={1}
            placeholder={translate("custom_amount_placeholder")}
            style={{ width: "100%" }}
          />,
        )}
      </Form.Item>
      <Form.Item style={styles.customPriceCurrencyFormItem}>
        {props.getFieldDecorator("customPrice.currency")(
          <Select
            size="large"
            defaultValue="USD"
            style={{ width: "100%" }}
            placeholder={translate("custom_currency_placeholder")}
          >
            {availableCurrencies.map(currency => (
              <Select.Option
                key={currency}
                value={currency}
                loading={loading}
                disabled={loading}
              >
                {currency}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </div>
  ) : null;
};

export default PackageCustomize;
