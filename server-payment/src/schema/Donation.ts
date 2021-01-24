import { gql } from "apollo-server-core";

export const typeDef = gql`
  input DonationFilter {
    paymentConfirmed: Boolean
    search: String
    ids: [String!]
    packageId: String
  }

  input DonationInput {
    fullName: String!
    email: String!
    phoneNumber: String!
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
    phoneNumber: String!
    packageId: String!
    notes: String
    paymentConfirmed: Boolean!
    date: Date!
    quantity: Int!
    ip: String
  }

  type DonationCreationResult {
    donation: Donation!
    package: Package!
    formHtmlTags: [String!]!
  }
`;
