import React, { useContext } from "react";
import { Form, Select } from "antd";

import { getPackageName } from "../../../../utils";
import { TranslationContext } from "../../../../translations";
import { PackageContext } from "./PackageContext";

import PackageDetails from "./PackageDetails";

const PackageSelect = props => {
  const { translate, langCode } = useContext(TranslationContext);
  const { loading, packages, selectPackage } = useContext(PackageContext);

  return (
    <div style={{ width: "100%", marginRight: 10 }}>
      <Form.Item style={{ marginBottom: 0 }}>
        {props.getFieldDecorator("packageId", {
          rules: [
            {
              required: true,
              message: translate("packageid_validation_error"),
            },
          ],
        })(
          <Select
            placeholder={translate("select_package")}
            size="large"
            loading={loading}
            disabled={loading}
            onSelect={value =>
              selectPackage(packages.find(p => p.id === value))
            }
          >
            {!loading &&
              packages.map(pack => (
                <Select.Option key={pack.id} value={pack.id}>
                  {getPackageName(pack, langCode)} - {pack.price.amount}
                  {pack.price.currency}
                </Select.Option>
              ))}
          </Select>,
        )}
      </Form.Item>
      <div style={{ marginTop: 5, marginBottom: 15 }}>
        <PackageDetails />
      </div>
    </div>
  );
};

export default PackageSelect;
