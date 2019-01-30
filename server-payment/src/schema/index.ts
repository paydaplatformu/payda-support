import { gql, IResolvers } from "apollo-server-express";
import { merge } from "lodash";
import { IDonationCreator } from "../models/Donation";
import { AuthorizationError, AuthorizationRequired } from "../models/Errors";
import { IPackageCreator, IPackageModifier } from "../models/Package";
import { IContext } from "./context";
import { typeDef as Currency } from "./Currency";
import { resolvers as dateResolvers, typeDef as DateType } from "./Date";
import { typeDef as Donation } from "./Donation";
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
    _allDonationsMeta(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: DonationFilter
    ): ListMetadata
  }

  type Mutation {
    createPackage(
      defaultTag: PackageTagInput!
      reference: String
      repeatConfig: RepeatConfig!
      image: String
      price: MonateryAmountInput!
      priority: Int!
      tags: [PackageTagInput!]
    ): Package!
    updatePackage(
      id: String!
      defaultTag: PackageTagInput
      reference: String
      image: String
      priority: Int
      tags: [PackageTagInput!]
    ): Package

    createDonation(fullName: String!, email: String!, packageId: String!): Donation!
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
      return userService.getAll(
        {},
        { page: 1, perPage: Number.MAX_SAFE_INTEGER },
        { sortOrder: "ASC", sortField: "id" }
      );
    },

    Package: (parent, { id }, { packageService }) => packageService.getById(id),
    allPackages: (
      parent,
      { filter: { onlyActive, ids } = { onlyActive: true, ids: undefined }, sortField, sortOrder, page, perPage },
      { packageService, user }
    ) => {
      if (!user && onlyActive === false) throw new AuthorizationError("Only admins can view non-active packages.");
      const pagination = { page, perPage };
      const sorting = { sortField, sortOrder };
      if (!user) return packageService.getAll({ onlyActive: true, ids }, pagination, sorting);
      return packageService.getAll({ onlyActive, ids }, pagination, sorting);
    },
    _allPackagesMeta: async (parent, { filter }, { packageService, user }) => {
      // if (!user) throw new AuthorizationRequired();
      if (!user) return { count: packageService.count({ onlyActive: true, ids: filter.ids }) };
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
    createPackage: (parent, args, { packageService, user }) => {
      // if (!user) throw new AuthorizationRequired();
      return packageService.create(args as IPackageCreator);
    },
    updatePackage: (parent, args, { packageService, user }) => {
      // if (!user) throw new AuthorizationRequired();
      return packageService.edit(args as IPackageModifier);
    },
    createDonation: (parent, args, { donationService, user }) => donationService.create(args as IDonationCreator),
    cleanPendingDonations: (parent, args, { donationService, user }) => {
      // if (!user) throw new AuthorizationRequired();
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

export const resolvers = merge(dateResolvers, rootResolvers, packageResolvers, userResolvers);
