import React, { useContext } from "react";
import { Form, Select } from "antd";

import { getPackageNameAndDescription } from "../../../../utils";
import { TranslationContext } from "../../../../translations";
import { PackageContext } from "./PackageContext";

import PackageDetails from "./PackageDetails";

const PackageSelect = props => {
  const { translate, langCode } = useContext(TranslationContext);
  const { loading, packages } = useContext(PackageContext);

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
          >
            {!loading &&
              packages.map(pack => (
                <Select.Option key={pack.id} value={pack.id}>
                  {getPackageNameAndDescription(pack, langCode)}
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
