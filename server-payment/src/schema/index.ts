import { gql, IResolvers } from "apollo-server-express";
import { merge } from "lodash";
import { IDonationCreator } from "../models/Donation";
import { AuthorizationError, AuthenticationRequired } from "../models/Errors";
import { IPackageCreator, IPackageModifier } from "../models/Package";
import { ISubscriptionModifier } from "../models/Subscription";
import { IContext } from "./context";
import { typeDef as Currency } from "./Currency";
import { resolvers as dateResolvers, typeDef as DateType } from "./Date";
import { typeDef as DeactivationReason } from "./DeactivationReason";
import { typeDef as Donation } from "./Donation";
import { typeDef as FormField } from "./FormField";
import { resolvers as jsonResolvers, typeDef as JsonType } from "./Json";
import { typeDef as LanguageCode } from "./LanguageCode";
import { typeDef as ListMetadata } from "./ListMetadata";
import { typeDef as MonetaryAmount } from "./MonetaryAmount";
import { resolvers as packageResolvers, typeDef as Package } from "./Package";
import { typeDef as PackageTag } from "./PackageTag";
import { typeDef as PaymentProcess } from "./PaymentProcess";
import { typeDef as RepeatConfig } from "./RepeatConfig";
import { typeDef as Subscription } from "./Subscription";
import { typeDef as SubscriptionChargeResult } from "./SubscriptionChargeResult";
import { typeDef as SubscriptionStatus } from "./SubscriptionStatus";
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

    ChargableSubscription(id: String!): Subscription
    allChargableSubscriptions(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: SubscriptionFilter
    ): [Subscription!]!
    _allChargableSubscriptionsMeta(
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
      price: MonetaryAmountInput!
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

    chargeSubscription(id: String!): SubscriptionChargeResult!

    cancelSubscription(is: String!): Subscription
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
      if (!user) throw new AuthenticationRequired();
      return userService.getAll(
        {},
        { page: 1, perPage: Number.MAX_SAFE_INTEGER },
        { sortOrder: "ASC", sortField: "id" }
      );
    },

    Package: (parent, { id }, { packageService }) => packageService.getById(id),
    allPackages: (
      parent,
      {
        filter: { onlyActive, ids, isCustom } = { onlyActive: true, ids: undefined, isCustom: false },
        sortField,
        sortOrder,
        page,
        perPage
      },
      { packageService, user }
    ) => {
      if (!user && onlyActive === false) throw new AuthorizationError("Only admins can view non-active packages.");
      const pagination = { page, perPage };
      const sorting = { sortField, sortOrder };
      if (!user) return packageService.getAll(packageService.getDefaultFilters(), pagination, sorting);
      return packageService.getAll({ onlyActive, ids, isCustom }, pagination, sorting);
    },
    _allPackagesMeta: async (parent, { filter }, { packageService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return { count: await packageService.count(filter) };
    },

    Donation: (parent, { id }, { donationService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return donationService.getById(id);
    },
    allDonations: (parent, { filter, sortField, sortOrder, page, perPage }, { donationService, user }) => {
      if (!user) throw new AuthenticationRequired();
      const pagination = { page, perPage };
      const sorting = { sortField, sortOrder };
      return donationService.getAll(filter, pagination, sorting);
    },
    _allDonationsMeta: async (parent, { filter }, { donationService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return { count: await donationService.count(filter) };
    },

    Subscription: (parent, { id }, { subscriptionService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return subscriptionService.getById(id);
    },
    allSubscriptions: (parent, { filter, sortField, sortOrder, page, perPage }, { subscriptionService, user }) => {
      if (!user) throw new AuthenticationRequired();
      const pagination = { page, perPage };
      const sorting = { sortField, sortOrder };
      return subscriptionService.getAll(filter, pagination, sorting);
    },
    _allSubscriptionsMeta: async (parent, { filter }, { subscriptionService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return { count: await subscriptionService.count(filter) };
    },

    ChargableSubscription: (parent, { id, repeatConfig }, { subscriptionManagerService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return subscriptionManagerService.getChargableSubscriptionById(id, repeatConfig);
    },
    allChargableSubscriptions: (
      parent,
      { filter: { repeatConfig, ...restFilters }, sortField, sortOrder, page, perPage },
      { subscriptionManagerService, user }
    ) => {
      if (!user) throw new AuthenticationRequired();
      const pagination = { page, perPage };
      const sorting = { sortField, sortOrder };
      return subscriptionManagerService.getChargableSubscriptions(repeatConfig, restFilters, pagination, sorting);
    },
    _allChargableSubscriptionsMeta: async (
      parent,
      { repeatConfig, ...restFilters },
      { subscriptionManagerService, user }
    ) => {
      if (!user) throw new AuthenticationRequired();
      return { count: await subscriptionManagerService.countChargableSubscriptions(repeatConfig, restFilters) };
    }
  },
  Mutation: {
    createPackage: (parent, args, { packageService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return packageService.create({
        ...(args as IPackageCreator),
        isCustom: false
      });
    },
    updatePackage: (parent, args, { packageService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return packageService.edit(args as IPackageModifier);
    },
    createDonation: async (parent, { donationCreator, language }, { donationManagerService }) => {
      return donationManagerService.createDonation(donationCreator as IDonationCreator, language);
    },
    cleanPendingDonations: (parent, args, { donationService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return donationService.cleanPendingDonations();
    },

    updateSubscription: (parent, args, { subscriptionService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return subscriptionService.edit(args as ISubscriptionModifier);
    },

    chargeSubscription: (parent, { id }, { payuService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return payuService.chargeUsingToken(id);
    },

    cancelSubscription: (parent, { id }, { subscriptionService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return subscriptionService.cancelSubscription(id);
    }
  }
};

export const typeDefs = [
  DateType,
  JsonType,
  RepeatConfig,
  Currency,
  MonetaryAmount,
  PaymentProcess,
  LanguageCode,
  DeactivationReason,
  SubscriptionStatus,
  FormField,
  PackageTag,
  SubscriptionChargeResult,
  SchemaDefinition,
  Query,
  Package,
  Donation,
  Subscription,
  User,
  ListMetadata
];

export const resolvers = merge(dateResolvers, jsonResolvers, rootResolvers, packageResolvers, userResolvers);
