import { gql } from "apollo-server-core";

export const typeDef = gql`
  type ChargableSubscription {
    id: String!
    packageId: String!
    donationId: String!
    processHistory: [PaymentProcess!]!
    deactivationReason: DeactivationReason
    hasPaymentToken: Boolean!
    status: SubscriptionStatus!
    createdAt: Date!
    updatedAt: Date!
  }
`;
