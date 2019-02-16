import { gql } from "apollo-server-core";

export const typeDef = gql`
  type SubscriptionChargeResult {
    status: Boolean!
    body: String!
  }
`;
