import { gql } from "apollo-server-core";
import { AuthenticationRequired } from "../models/Errors";
import { PackageResolvers } from "../generated/graphql";

export const typeDef = gql`
  input PackageFilter {
    ids: [String!]
    onlyActive: Boolean
    onlyOriginal: Boolean
    repeatInterval: RepeatInterval
    amount: Float
    currency: Currency
    search: String
  }

  type Package {
    id: String!
    defaultTag: PackageTag!
    reference: String
    createdAt: Date!
    updatedAt: Date!
    repeatInterval: RepeatInterval!
    donationCount: Int!
    image: String
    price: MonetaryAmount!
    customizationConfig: PackageCustomizationConfig!
    isCustom: Boolean!
    priority: Int!
    tags: [PackageTag!]!
    isActive: Boolean!
  }
`;

export const resolvers: PackageResolvers = {
  donationCount: (parent, args, { donationService, user }) => {
    if (!user) throw new AuthenticationRequired();
    return donationService.countByPackageId(parent.id);
  }
};
