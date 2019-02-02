import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { Form, Select } from "antd";

const query = gql`
  {
    allPackages {
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

const PackageSelect = props => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error!</p>;

      return (
        <>
          <Form.Item>
            {props.getFieldDecorator("packageId", {
              rules: [{ required: true, message: "Lutfen bir paket seciniz" }],
            })(
              <Select placeholder="Bagis paketi seciniz" size="large">
                {data.allPackages.map(
                  ({ id, defaultTag: { name, description } }) => (
                    <Select.Option key={id} value={id}>
                      {name} - {description}
                    </Select.Option>
                  ),
                )}
              </Select>,
            )}
          </Form.Item>
        </>
      );
    }}
  </Query>
);

export default PackageSelect;
