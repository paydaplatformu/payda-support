import { gql } from "apollo-server-core";
import { IResolvers } from "graphql-tools";
import { IDonation } from "../models/Donation";
import { IContext } from "./context";

export const typeDef = gql`
  input DonationFilter {
    paymentConfirmed: Boolean
  }

  input DonationCreator {
    fullName: String!
    email: String!
    packageId: String!
    quantity: Int!
    usingAmex: Boolean!
  }

  type Donation {
    id: String!
    fullName: String!
    email: String!
    packageId: String!
    paymentConfirmed: Boolean!
    date: Date!
    usingAmex: Boolean!
    quantity: Int!
  }

  type DonationCreationResult {
    donation: Donation!
    package: Package!
    formFields: [FormField!]!
  }
`;
