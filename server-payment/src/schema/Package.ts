import { gql } from "apollo-server-core";
import { IResolvers } from "graphql-tools";
import { AuthenticationRequired } from "../models/Errors";
import { IPackage } from "../models/Package";
import { IContext } from "./context";

export const typeDef = gql`
  input PackageFilter {
    ids: [String!]
    onlyActive: Boolean
    showCustom: Boolean
    repeatInterval: RepeatInterval
    amount: Float
    currency: Currency
    search: String
  }

  type Package {
    id: String!
    defaultTag: PackageTag
    reference: String
    createdAt: Date!
    updatedAt: Date!
    repeatInterval: RepeatInterval!
    donationCount: Int!
    image: String
    price: MonetaryAmount!
    customizationConfig: PackageCustomizationConfig!
    isCustom: Boolean!
    priority: Int
    tags: [PackageTag!]!
    isActive: Boolean!
  }
`;

export const resolvers: IResolvers<IPackage, IContext> = {
  Package: {
    donationCount: (parent, args, { donationService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return donationService.countByPackageId(parent.id);
    }
  }
};
