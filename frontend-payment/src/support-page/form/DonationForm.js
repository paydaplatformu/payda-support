import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { Form, Input, InputNumber, Checkbox } from "antd";
import SubmitButton from "./SubmitButton";
import PackageSelect from "./PackageSelect";
import PayUForm from "./PayUForm";

const CREATE_DONATION = gql`
  mutation CreateDonation(
    $donationCreator: DonationCreator!
    $language: LanguageCode!
  ) {
    createDonation(donationCreator: $donationCreator, language: $language) {
      formFields {
        key
        value
      }
      formUrl
    }
  }
`;

class AntForm extends Component {
  onSubmitForm = createDonation => e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldValues) => {
      if (err) return;

      createDonation({
        variables: {
          donationCreator: fieldValues,
          language: "TR",
        },
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Mutation mutation={CREATE_DONATION}>
        {(createDonation, { loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error!</p>;

          if (!data) {
            return (
              <Form onSubmit={this.onSubmitForm(createDonation)}>
                <PackageSelect getFieldDecorator={getFieldDecorator} />
                <Form.Item label="Adet" style={{ display: "flex" }}>
                  {getFieldDecorator("quantity", { initialValue: 1 })(
                    <InputNumber min={1} size="large" />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("fullName", {
                    rules: [
                      { required: true, message: "Lutfen isminizi giriniz" },
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
                <Form.Item>
                  {getFieldDecorator("usingAmex", {
                    valuePropName: "checked",
                  })(
                    <Checkbox>
                      Odememi American Express kullanarak yapacagim
                    </Checkbox>,
                  )}
                </Form.Item>
                <Form.Item>
                  <SubmitButton htmlType="submit" size="large" block>
                    Destek Ol!
                  </SubmitButton>
                </Form.Item>
              </Form>
            );
          }

          if (data) {
            const formFields =
              data.createDonation && data.createDonation.formFields;
            const formUrl = data.createDonation && data.createDonation.formUrl;

            return <PayUForm formFields={formFields} formUrl={formUrl} />;
          }
        }}
      </Mutation>
    );
  }
}

export default Form.create({ name: "donate" })(AntForm);
