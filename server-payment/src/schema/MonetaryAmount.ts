import { gql } from "apollo-server-core";

export const typeDef = gql`
  input MonetaryAmountInput {
    currency: Currency!
    amount: Float!
  }

  type MonetaryAmount {
    currency: Currency!
    amount: Float!
  }
`;
