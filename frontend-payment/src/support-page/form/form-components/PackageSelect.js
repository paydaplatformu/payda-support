import React, { useContext } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Form, Select, Spin } from "antd";

import { TranslationContext } from "../../../translations";

const query = gql`
  query AllPackages($sortOrder: String, $sortField: String) {
    allPackages(sortOrder: $sortOrder, sortField: $sortField) {
      id
      defaultTag {
        code
        name
        description
      }
      tags {
        code
        name
        description
      }
    }
  }
`;

const PackageSelect = props => {
  const { translate, langCode } = useContext(TranslationContext);

  const getPackageTag = pack =>
    (pack.tags && pack.tags.find(tag => tag.code === langCode.toUpperCase())) ||
    pack.defaultTag;

  const getPackageNameAndDescription = pack => {
    const packageTag = getPackageTag(pack);

    return `${packageTag.name} - ${packageTag.description}`;
  };

  return (
    <Form.Item style={{ width: "100%", marginRight: 10 }}>
      {props.getFieldDecorator("packageId", {
        rules: [
          {
            required: true,
            message: translate("packageid_validation_error"),
          },
        ],
      })(
        <Query
          query={query}
          variables={{ sortOrder: "DESC", sortField: "priority" }}
        >
          {({ loading, error, data }) => {
            if (loading)
              return (
                <Select
                  placeholder={translate("select_package")}
                  size="large"
                  disabled
                  loading
                />
              );

            if (error) return <p>Error!</p>;

            return (
              <Select placeholder={translate("select_package")} size="large">
                {data.allPackages.map(pack => (
                  <Select.Option key={pack.id} value={pack.id}>
                    {getPackageNameAndDescription(pack)}
                  </Select.Option>
                ))}
              </Select>
            );
          }}
        </Query>,
      )}
    </Form.Item>
  );
};

export default PackageSelect;
