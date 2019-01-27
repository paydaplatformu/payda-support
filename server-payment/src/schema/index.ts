import { gql, IResolvers } from "apollo-server-express";
import { merge } from "lodash";
import { IDonationCreator } from "../models/Donation";
import { AuthorizationError, AuthorizationRequired } from "../models/Errors";
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
import { typeDef as ListMetadata } from "./ListMetadata";
import { resolvers as userResolvers, typeDef as User } from "./User";

const Query = gql`
  type Query {
    users: [User!]!

    Package(id: String!): Package
    allPackages(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PackageFilter): [Package!]!
    _allPackagesMeta(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PackageFilter): ListMetadata

    Donation(id: String!): Donation
    allDonations(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: DonationFilter): [Donation!]!
    _allDonationsMeta(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: DonationFilter): ListMetadata
  }

  type Mutation {
    createPackage(packageCreator: PackageCreator!): Package!
    editPackage(packageModifier: PackageModifier!): Package
    activatePackage(id: String!): String
    deactivatePackage(id: String!): String

    createDonation(donationCreator: DonationCreator!): Package!
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
      // if (!user) throw new AuthorizationRequired();
      return userService.getAll();
    },

    Package: (parent, { id }, { packageService }) => packageService.getById(id),
    allPackages: (parent, { filter: { onlyActive }, sortField, sortOrder, page, perPage }, { packageService, user }) => {
      if (!user && onlyActive === false) throw new AuthorizationError("Only admins can view non-active packages.");
      const pagination = { page, perPage };
      const sorting = { sortField, sortOrder };
      if (!user) return packageService.getAll({ onlyActive: true }, pagination, sorting);
      return packageService.getAll({ onlyActive }, pagination, sorting);
    },
    _allPackagesMeta: async (parent, { filter }, { packageService, user }) => {
      // if (!user) throw new AuthorizationRequired();
      if (!user) return { count: packageService.count({ onlyActive: true }) };
      return { count: await packageService.count(filter) };
    },

    Donation: (parent, { id }, { donationService, user }) => {
      // if (!user) throw new AuthorizationRequired();
      return donationService.getById(id);
    },
    allDonations: (parent, { filter, sortField, sortOrder, page, perPage }, { donationService, user }) => {
      // if (!user) throw new AuthorizationRequired();
      const pagination = { page, perPage };
      const sorting = { sortField, sortOrder };      
      return donationService.getAll(filter, pagination, sorting);
    },
    _allDonationsMeta: async (parent, { filter }, { donationService, user }) => {
      // if (!user) throw new AuthorizationRequired();
      return { count: await donationService.count(filter) };
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
  User,
  ListMetadata
];

export const resolvers = merge(dateResolvers, rootResolvers, packageResolvers, donationResolvers, userResolvers);
