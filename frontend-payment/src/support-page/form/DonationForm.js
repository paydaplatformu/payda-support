import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { Form, Input, InputNumber, Checkbox } from "antd";
import SubmitButton from "./SubmitButton";
import PackageSelect from "./PackageSelect";
import PayUForm from "./PayUForm";
import TermsOfServiceModal from "./TermsOfServiceModal";
import ReturnPolicyModal from "./ReturnPolicyModal";

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
  state = {
    isTermsOfServiceVisible: false,
    isReturnPolicyVisible: false,
  };

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

  showTermsOfService = () => this.setState({ isTermsOfServiceVisible: true });

  dismissTermsOfService = () =>
    this.setState({ isTermsOfServiceVisible: false });

  showReturnPolicy = () => this.setState({ isReturnPolicyVisible: true });

  dismissReturnPolicy = () => this.setState({ isReturnPolicyVisible: false });

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <>
        <TermsOfServiceModal
          visible={this.state.isTermsOfServiceVisible}
          dismissModal={this.dismissTermsOfService}
        />
        <ReturnPolicyModal
          visible={this.state.isReturnPolicyVisible}
          dismissModal={this.dismissReturnPolicy}
        />
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
                  <Form.Item style={{ marginBottom: 0 }}>
                    {getFieldDecorator("usingAmex", {
                      valuePropName: "checked",
                    })(
                      <Checkbox>
                        Odememi American Express kullanarak yapacagim
                      </Checkbox>,
                    )}
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 40 }}>
                    {getFieldDecorator("agreementsAccepted", {
                      valuePropName: "checked",
                      rules: [
                        {
                          required: true,
                          message: "Bu secenegin secilmesi zorunludur",
                        },
                      ],
                    })(
                      <>
                        <Checkbox />{" "}
                        <a onClick={this.showTermsOfService}>
                          Satis Sozlesmesi
                        </a>{" "}
                        ve <a onClick={this.showReturnPolicy}>Iade Sartlari</a>
                        'ni okudum, kabul ediyorum.
                      </>,
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
              const formUrl =
                data.createDonation && data.createDonation.formUrl;

              return <PayUForm formFields={formFields} formUrl={formUrl} />;
            }
          }}
        </Mutation>
      </>
    );
  }
}

export default Form.create({ name: "donate" })(AntForm);
