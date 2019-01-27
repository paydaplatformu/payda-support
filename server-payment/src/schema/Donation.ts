import { gql } from "apollo-server-core";
import { IResolvers } from "graphql-tools";
import { IDonation } from "../models/Donation";
import { IContext } from "./context";

export const typeDef = gql`

  input DonationFilter {
    paymentConfirmed: Boolean
  }

  type Donation {
    id: String!
    fullName: String!
    email: String!
    packageId: String!
    paymentConfirmed: Boolean!
    date: Date!
  }
`;

