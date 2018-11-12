import { gql } from "apollo-server-core";
import { IResolvers } from "graphql-tools";
import { IPackage } from "../models/Package";
import { IContext } from "./context";

export const typeDef = gql`
  input PackageCreator {
    defaultTag: PackageTagInput!
    reference: String
    repeatConfig: RepeatConfig!
    image: String
    price: MonateryAmountInput!
    priority: Int!
    tags: [PackageTagInput!]!
  }

  input PackageModifier {
    id: String!
    defaultTag: PackageTagInput!
    reference: String
    image: String
    priority: Int!
    tags: [PackageTagInput!]!
  }

  type Package {
    id: String!
    defaultTag: PackageTag
    reference: String
    createdAt: Date!
    updatedAt: Date!
    repeatConfig: RepeatConfig!
    donations: [Donation!]!
    image: String
    price: MonateryAmount!
    priority: Int
    tags: [PackageTag!]!
    isActive: Boolean
  }
`;

export const resolvers: IResolvers<IPackage, IContext> = {
  Package: {
    donations: (parent, args, { donationService }) => donationService.getByPackageId(parent.id)
  }
};
