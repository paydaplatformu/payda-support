import { gql } from "apollo-server-core";
import { IResolvers } from "graphql-tools";
import { AuthorizationRequired } from "../models/Errors";
import { IPackage } from "../models/Package";
import { IContext } from "./context";

export const typeDef = gql`

  input PackageFilter {
    onlyActive: Boolean
  }

  type Package {
    id: String!
    defaultTag: PackageTag
    reference: String
    createdAt: Date!
    updatedAt: Date!
    repeatConfig: RepeatConfig!
    donations: [Donation!]!
    donationCount: Int!
    image: String
    price: MonateryAmount!
    priority: Int
    tags: [PackageTag!]!
    isActive: Boolean
  }
`;

export const resolvers: IResolvers<IPackage, IContext> = {
  Package: {
    donations: (parent, args, { donationService, user }) => {
      // if (!user) throw new AuthorizationRequired();
      return donationService.getByPackageId(parent.id);
    },
    donationCount: (parent, args, { donationService, user }) => {
      // if (!user) throw new AuthorizationRequired();
      return donationService.countByPackageId(parent.id);
    }
  }
};
