import { gql } from "apollo-server-core";

export const typeDef = gql`
  input MonateryAmountInput {
    currency: Currency!
    amount: Float!
  }

  type MonateryAmount {
    currency: Currency!
    amount: Float!
  }
`;
