import { gql } from "apollo-server-core";

export const typeDef = gql`
  input PackageCustomizationConfigInput {
    allowPriceAmountCustomization: Boolean!
    allowPriceCurrencyCustomization: Boolean!
    allowRepeatIntervalCustomization: Boolean!
  }

  type PackageCustomizationConfig {
    allowPriceAmountCustomization: Boolean!
    allowPriceCurrencyCustomization: Boolean!
    allowRepeatIntervalCustomization: Boolean!
  }
`;
