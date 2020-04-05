import { gql } from "apollo-server-core";

export const typeDef = gql`
  input ChargableSubscriptionFilter {
    ids: [String!]
    status: SubscriptionStatus
    repeatInterval: RepeatInterval!
    hasPaymentToken: Boolean
  }

  input SubscriptionFilter {
    ids: [String!]
    status: SubscriptionStatus
    repeatInterval: RepeatInterval
    hasPaymentToken: Boolean
  }

  type Subscription {
    id: String!
    packageId: String!

    "The language user chose while starting the subscription. Helpful for communicating with the user"
    language: LanguageCode!

    "Original donation made by the user"
    donationId: String!

    processHistory: [PaymentProcess!]!
    deactivationReason: DeactivationReason
    hasPaymentToken: Boolean!
    status: SubscriptionStatus!
    createdAt: Date!
    updatedAt: Date!
  }
`;

export const resolvers = {};
