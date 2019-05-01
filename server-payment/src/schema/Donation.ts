import { gql } from "apollo-server-core";

export const typeDef = gql`
  input DonationFilter {
    paymentConfirmed: Boolean
    search: String
    ids: [String!]
    packageId: String
  }

  input DonationCreator {
    fullName: String!
    email: String!
    packageId: String!
    customPriceAmount: Float
    customPriceCurrency: Currency
    customRepeatInterval: RepeatInterval
    notes: String
    quantity: Int!
    usingAmex: Boolean!
  }

  type Donation {
    id: String!
    fullName: String!
    email: String!
    packageId: String!
    notes: String
    paymentConfirmed: Boolean!
    date: Date!
    usingAmex: Boolean!
    quantity: Int!
  }

  type DonationCreationResult {
    donation: Donation!
    package: Package!
    subscription: Subscription
    formUrl: String!
    formFields: [FormField!]!
  }
`;
