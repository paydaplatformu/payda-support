import { gql } from "apollo-server-core";

export const typeDef = gql`
  input DonationFilter {
    paymentConfirmed: Boolean
    search: String
    ids: [String!]
    packageId: String

    "If true only shows donations that was created by user, excluding automated subscriptions"
    onlyDirect: Boolean
  }

  input DonationInput {
    fullName: String!
    email: String!
    packageId: String!
    customPriceAmount: Float
    customPriceCurrency: Currency
    customRepeatInterval: RepeatInterval
    notes: String
    quantity: Int!
  }

  type Donation {
    id: String!
    fullName: String!
    email: String!
    packageId: String!
    notes: String
    paymentConfirmed: Boolean!
    date: Date!
    quantity: Int!

    ip: String

    "If the donation is created because of a subscription, this will point to the original user donation"
    parentDonationId: String
  }

  type DonationCreationResult {
    donation: Donation!
    package: Package!
    subscription: Subscription
    formHtmlTags: [String!]!
  }
`;
