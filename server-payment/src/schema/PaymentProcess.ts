import { gql } from "apollo-server-core";

export const typeDef = gql`
  type PaymentProcess {
    date: Date!
    result: JSON
    isSuccess: Boolean!
  }
`;
