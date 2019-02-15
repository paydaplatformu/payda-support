import { gql } from "apollo-server-core";

export const typeDef = gql`
  enum SubscriptionStatus {
    CREATED
    RUNNING
    CANCELLED
  }
`;
