import { gql } from "apollo-server-core";
import { IResolvers } from "graphql-tools";
import { AuthorizationRequired } from "../models/Errors";
import { IPackage } from "../models/Package";
import { IContext } from "./context";

export const typeDef = gql`
  input PackageFilter {
    ids: [String!]
    onlyActive: Boolean
  }

  type Package {
    id: String!
    defaultTag: PackageTag
    reference: String
    createdAt: Date!
    updatedAt: Date!
    repeatConfig: RepeatConfig!
    donationCount: Int!
    image: String
    price: MonetaryAmount!
    isCustomizable: Boolean!
    isCustom: Boolean!
    priority: Int
    tags: [PackageTag!]!
    isActive: Boolean!
  }
`;

export const resolvers: IResolvers<IPackage, IContext> = {
  Package: {
    donationCount: (parent, args, { donationService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return donationService.countByPackageId(parent.id);
    }
  }
};
