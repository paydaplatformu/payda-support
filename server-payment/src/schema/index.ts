import { gql, IResolvers } from "apollo-server-express";
import { merge } from "lodash";
import { DonationCreator } from "../models/Donation";
import { AuthenticationRequired, AuthorizationError } from "../models/Errors";
import { PackageCreator, PackageModifier } from "../models/Package";
import { SubscriptionModifier } from "../models/Subscription";
import { typeDef as ChargableSubscription } from "./ChargableSubscription";
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
import { typeDef as PackageCustomizationConfig } from "./PackageCustomizationConfig";
import { typeDef as PackageTag } from "./PackageTag";
import { typeDef as PaymentProcess } from "./PaymentProcess";
import { typeDef as RepeatInterval } from "./RepeatInterval";
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

    ChargableSubscription(id: String!): ChargableSubscription
    allChargableSubscriptions(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: SubscriptionFilter
    ): [ChargableSubscription!]!
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
      customizationConfig: PackageCustomizationConfigInput!
      reference: String
      repeatInterval: RepeatInterval!
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

    updateSubscription(id: String!, status: SubscriptionStatus!): Subscription

    chargeSubscription(id: String!): SubscriptionChargeResult!

    cancelSubscription(id: String!): Subscription
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
    allPackages: (parent, { filter, sortField, sortOrder, page, perPage }, { packageService, user }) => {
      if (!user && filter && filter.onlyActive === false)
        throw new AuthorizationError("Only admins can view non-active packages.");
      const pagination = { page, perPage };
      const sorting = { sortField, sortOrder };
      if (!user) return packageService.getAll(packageService.getDefaultFilters(), pagination, sorting);
      return packageService.getAll(filter, pagination, sorting);
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

    ChargableSubscription: (parent, { id }, { subscriptionManagerService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return subscriptionManagerService.getChargableSubscriptionById(id);
    },
    allChargableSubscriptions: (
      parent,
      { filter: { repeatInterval, ...restFilters }, sortField, sortOrder, page, perPage },
      { subscriptionManagerService, user }
    ) => {
      if (!user) throw new AuthenticationRequired();
      const pagination = { page, perPage };
      const sorting = { sortField, sortOrder };
      return subscriptionManagerService.getChargableSubscriptions(repeatInterval, restFilters, pagination, sorting);
    },
    _allChargableSubscriptionsMeta: async (
      parent,
      { filter: { repeatInterval, ...restFilters } },
      { subscriptionManagerService, user }
    ) => {
      if (!user) throw new AuthenticationRequired();
      return { count: await subscriptionManagerService.countChargableSubscriptions(repeatInterval, restFilters) };
    }
  },
  Mutation: {
    createPackage: (parent, args, { packageService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return packageService.create({
        ...(args as PackageCreator),
        isCustom: false
      });
    },
    updatePackage: (parent, args, { packageService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return packageService.edit(args as PackageModifier);
    },
    createDonation: async (parent, { donationCreator, language }, { donationManagerService }) => {
      const saneDonationCreator: DonationCreator = {
        ...(donationCreator as DonationCreator),
        parentDonationId: undefined
      };
      return donationManagerService.createDonation(saneDonationCreator, language);
    },
    cleanPendingDonations: (parent, args, { donationService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return donationService.cleanPendingDonations();
    },

    updateSubscription: (parent, args, { subscriptionService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return subscriptionService.edit(args as SubscriptionModifier);
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
  RepeatInterval,
  Currency,
  MonetaryAmount,
  PaymentProcess,
  LanguageCode,
  DeactivationReason,
  SubscriptionStatus,
  FormField,
  PackageTag,
  PackageCustomizationConfig,
  SubscriptionChargeResult,
  SchemaDefinition,
  Query,
  Package,
  Donation,
  Subscription,
  User,
  ListMetadata,
  ChargableSubscription
];

export const resolvers = merge(dateResolvers, jsonResolvers, rootResolvers, packageResolvers, userResolvers);
