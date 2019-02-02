import { gql, IResolvers } from "apollo-server-express";
import { merge } from "lodash";
import { IDonationCreator } from "../models/Donation";
import { AuthorizationError, AuthorizationRequired } from "../models/Errors";
import { IPackageCreator, IPackageModifier } from "../models/Package";
import { ISubscriptionModifier } from "../models/Subscription";
import { IContext } from "./context";
import { typeDef as Currency } from "./Currency";
import { resolvers as dateResolvers, typeDef as DateType } from "./Date";
import { typeDef as Donation } from "./Donation";
import { typeDef as FormField } from "./FormField";
import { resolvers as jsonResolvers, typeDef as JsonType } from "./Json";
import { typeDef as LanguageCode } from "./LanguageCode";
import { typeDef as LastProcess } from "./LastProcess";
import { typeDef as ListMetadata } from "./ListMetadata";
import { typeDef as MonetaryAmount } from "./MonetaryAmount";
import { resolvers as packageResolvers, typeDef as Package } from "./Package";
import { typeDef as PackageTag } from "./PackageTag";
import { typeDef as RepeatConfig } from "./RepeatConfig";
import { typeDef as Subscription } from "./Subscription";
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

    Subscription(id: String!): Subscription
    allSubscriptions(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: SubscriptionFilter
    ): [Subscription!]!
    _allSubscriptionsMeta(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: SubscriptionFilter
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

    createDonation(donationCreator: DonationCreator!, language: LanguageCode!): DonationCreationResult!
    cleanPendingDonations: Int!

    updateSubscription(id: String!, isActive: Boolean!): Subscription
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
      if (!user) throw new AuthorizationRequired();
      return { count: await packageService.count(filter) };
    },

    Donation: (parent, { id }, { donationService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return donationService.getById(id);
    },
    allDonations: (parent, { filter, sortField, sortOrder, page, perPage }, { donationService, user }) => {
      if (!user) throw new AuthorizationRequired();
      const pagination = { page, perPage };
      const sorting = { sortField, sortOrder };
      return donationService.getAll(filter, pagination, sorting);
    },
    _allDonationsMeta: async (parent, { filter }, { donationService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return { count: await donationService.count(filter) };
    },

    Subscription: (parent, { id }, { subscriptionService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return subscriptionService.getById(id);
    },
    allSubscriptions: (parent, { filter, sortField, sortOrder, page, perPage }, { subscriptionService, user }) => {
      if (!user) throw new AuthorizationRequired();
      const pagination = { page, perPage };
      const sorting = { sortField, sortOrder };
      return subscriptionService.getAll(filter, pagination, sorting);
    },
    _allSubscriptionsMeta: async (parent, { filter }, { subscriptionService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return { count: await subscriptionService.count(filter) };
    }
  },
  Mutation: {
    createPackage: (parent, args, { packageService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return packageService.create(args as IPackageCreator);
    },
    updatePackage: (parent, args, { packageService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return packageService.edit(args as IPackageModifier);
    },
    createDonation: async (parent, { donationCreator, language }, { donationManagerService }) => {
      return donationManagerService.createDonation(donationCreator as IDonationCreator, language);
    },
    cleanPendingDonations: (parent, args, { donationService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return donationService.cleanPendingDonations();
    },

    updateSubscription: (parent, args, { subscriptionService, user }) => {
      if (!user) throw new AuthorizationRequired();
      return subscriptionService.edit(args as ISubscriptionModifier);
    }
  }
};

export const typeDefs = [
  DateType,
  JsonType,
  RepeatConfig,
  Currency,
  MonetaryAmount,
  LastProcess,
  LanguageCode,
  FormField,
  PackageTag,
  SchemaDefinition,
  Query,
  Package,
  Donation,
  Subscription,
  User,
  ListMetadata
];

export const resolvers = merge(dateResolvers, jsonResolvers, rootResolvers, packageResolvers, userResolvers);
