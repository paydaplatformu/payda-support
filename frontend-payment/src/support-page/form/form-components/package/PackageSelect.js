import React, { useContext } from "react";
import { Form, Select } from "antd";

import { TranslationContext } from "../../../../translations";
import { PackageContext } from "./PackageContext";

import {
  getPackageName,
  getPackagePriceText,
  isPackageRecurrent,
  getPackageRecurrencyTranslationKey
} from "../../../../utils";

import PackageDetails from "./PackageDetails";

const getPackageDisplayText = (pack, langCode) => {
  if (pack.price && pack.price.amount === 0) {
    return getPackageName(pack, langCode);
  }
  return `${getPackageName(pack, langCode)} - ${getPackagePriceText(pack)}`;
};

const PackageSelect = props => {
  const { translate, langCode } = useContext(TranslationContext);
  const { loading, packages, selectPackage } = useContext(PackageContext);

  const onPackageSelect = value => {
    const pkg = packages.find(p => p.id === value);
    selectPackage(pkg);
    props.onPackageSelect && props.onPackageSelect(pkg);
  };

  return (
    <div style={{ width: "100%", marginRight: 10 }}>
      <Form.Item style={{ marginBottom: 0 }}>
        {props.getFieldDecorator("packageId", {
          rules: [
            {
              required: true,
              message: translate("packageid_validation_error")
            }
          ]
        })(
          <Select
            placeholder={translate("select_package")}
            size="large"
            loading={loading}
            disabled={loading}
            onSelect={onPackageSelect}
          >
            {!loading &&
              packages.map(pack => (
                <Select.Option key={pack.id} value={pack.id}>
                  {getPackageDisplayText(pack, langCode)}{" "}
                  {isPackageRecurrent(pack.repeatInterval)
                    ? translate(
                        getPackageRecurrencyTranslationKey(pack.repeatInterval)
                      )
                    : null}
                </Select.Option>
              ))}
          </Select>
        )}
      </Form.Item>
      <div style={{ marginTop: 5, marginBottom: 15 }}>
        <PackageDetails />
      </div>
    </div>
  );
};

export default PackageSelect;
