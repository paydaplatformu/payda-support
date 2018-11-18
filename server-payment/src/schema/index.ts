import { gql, IResolvers } from "apollo-server-express";
import { merge } from "lodash";
import { IDonationCreator } from "../models/Donation";
import { IPackageCreator, IPackageModifier } from "../models/Package";
import { IContext } from "./context";
import { typeDef as Currency } from "./Currency";
import { resolvers as dateResolvers, typeDef as DateType } from "./Date";
import { resolvers as donationResolvers, typeDef as Donation } from "./Donation";
import { typeDef as LanguageCode } from "./LanguageCode";
import { typeDef as MonetaryAmount } from "./MonetaryAmount";
import { resolvers as packageResolvers, typeDef as Package } from "./Package";
import { typeDef as PackageTag } from "./PackageTag";
import { typeDef as RepeatConfig } from "./RepeatConfig";
import { resolvers as userResolvers, typeDef as User } from "./User";
import { AuthorizationRequired } from "../models/Errors";

const Query = gql`
  type Query {
    users: [User!]!

    package(id: String!): Package
    packages(onlyActive: Boolean): [Package!]!

    donation(id: String!): Donation
    donations: [Donation!]!
  }

  type Mutation {
    createPackage(packageCreator: PackageCreator!): Package!
    editPackage(packageModifier: PackageModifier!): Package
    activatePackage(id: String!): String
    deactivatePackage(id: String!): String

    createDonation: Package!
    cleanPendingDonations: Int!
  }
`;

const SchemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
  }
`;

const rootResolvers: IResolvers<any, IContext> = {
  Query: {
    users: (parent, { id }, { userService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return userService.getAll();
    },
    package: (parent, { id }, { packageService }) => packageService.getById(id),
    packages: (parent, { onlyActive }, { packageService }) => packageService.getAll({ onlyActive }),
    donation: (parent, { id }, { donationService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return donationService.getById(id);
    },
    donations: (parent, args, { donationService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return donationService.getAll();
    }
  },
  Mutation: {
    createPackage: (parent, { packageCreator }, { packageService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return packageService.create(packageCreator as IPackageCreator);
    },
    editPackage: (parent, { packageModifier }, { packageService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return packageService.edit(packageModifier as IPackageModifier);
    },
    activatePackage: (parent, { id }, { packageService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return packageService.activate(id);
    },
    deactivatePackage: (parent, { id }, { packageService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return packageService.deactivate(id);
    },
    createDonation: (parent, { donationCreator }, { donationService, user }) =>
      donationService.create(donationCreator as IDonationCreator),
    cleanPendingDonations: (parent, args, { donationService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return donationService.cleanPendingDonations();
    }
  }
};

export const typeDefs = [
  DateType,
  RepeatConfig,
  Currency,
  MonetaryAmount,
  LanguageCode,
  PackageTag,
  SchemaDefinition,
  Query,
  Package,
  Donation,
  User
];

export const resolvers = merge(dateResolvers, rootResolvers, packageResolvers, donationResolvers, userResolvers);
