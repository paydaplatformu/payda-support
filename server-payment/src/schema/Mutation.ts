import { gql } from "apollo-server-core";

export const Mutation = gql`
  type Mutation {
    createPackage(
      defaultTag: PackageTagInput!
      customizationConfig: PackageCustomizationConfigInput!
      reference: String
      repeatInterval: RepeatInterval!
      image: String
      price: MonetaryAmountInput!
      priority: Int!
      tags: [PackageTagInput!]
    ): Package!
    updatePackage(
      id: String!
      defaultTag: PackageTagInput
      isActive: Boolean
      customizationConfig: PackageCustomizationConfigInput
      reference: String
      image: String
      priority: Int
      tags: [PackageTagInput!]
    ): Package

    createDonation(donationInput: DonationInput!, language: LanguageCode!): DonationCreationResult!
    cleanPendingDonations: Int!

    updateSubscription(id: String!, status: SubscriptionStatus!): Subscription

    chargeSubscription(id: String!): SubscriptionChargeResult!

    cancelSubscription(id: String!): Subscription
  }
`;
