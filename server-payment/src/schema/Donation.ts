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
    package: Package!
    paymentConfirmed: Boolean!
    date: Date!
  }
`;

export const resolvers: IResolvers<IDonation, IContext> = {
  Donation: {
    package: (parent, args, { packageService }) => packageService.getById(parent.packageId)
  }
};
