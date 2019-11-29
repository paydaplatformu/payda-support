import { DonationCreator } from "../models/Donation";
import { AuthenticationRequired, AuthorizationError } from "../models/Errors";
import { PackageCreator, PackageModifier } from "../models/Package";
import { SubscriptionModifier } from "../models/Subscription";
import { typeDef as ChargableSubscription } from "./ChargableSubscription";
import { typeDef as Currency } from "./Currency";
import { resolver as dateResolver, typeDef as DateType } from "./Date";
import { typeDef as DeactivationReason } from "./DeactivationReason";
import { typeDef as Donation } from "./Donation";
import { typeDef as KeyValue } from "./KeyValue";
import { resolver as jsonResolver, typeDef as JsonType } from "./Json";
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
import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { makeExecutableSchema } from "graphql-tools";
import { SchemaDefinition } from "./SchemaDefinition";
import { Resolvers } from "../generated/graphql";

const resolvers: Resolvers = {
  Query: {
    Package: (parent, { id }, { packageService }) => packageService.getById(id),
    allPackages: (parent, { filter, sortField, sortOrder, page, perPage }, { packageService, user }) => {
      if (!user && filter && filter.onlyActive === false)
        throw new AuthorizationError("Only admins can view non-active packages.");
      const pagination = { page: page || 0, perPage: perPage || Number.MAX_SAFE_INTEGER };
      const sorting = { sortField, sortOrder };
      if (!user) return packageService.getAll(packageService.getDefaultFilters() || {}, null, sorting);
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
      const pagination = { page: page || 0, perPage: perPage || Number.MAX_SAFE_INTEGER };
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
      const pagination = { page: page || 0, perPage: perPage || Number.MAX_SAFE_INTEGER };
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
      { filter, sortField, sortOrder, page, perPage },
      { subscriptionManagerService, user }
    ) => {
      if (!user) throw new AuthenticationRequired();
      const pagination = { page: page || 0, perPage: perPage || Number.MAX_SAFE_INTEGER };
      const sorting = { sortField, sortOrder };
      return subscriptionManagerService.getChargableSubscriptions(filter, pagination, sorting);
    },
    _allChargableSubscriptionsMeta: async (parent, { filter }, { subscriptionManagerService, user }) => {
      if (!user) throw new AuthenticationRequired();
      return {
        count: await subscriptionManagerService.countChargableSubscriptions(filter)
      };
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
    createDonation: async (parent, { donationInput, language }, { donationManagerService }) => {
      const donationCreator: DonationCreator = {
        ...donationInput,
        parentDonationId: undefined
      };
      return donationManagerService.createDonation(donationCreator, language);
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
  },
  Date: dateResolver,
  Package: packageResolvers,
  JSON: jsonResolver
};

const typeDefs = [
  DateType,
  JsonType,
  RepeatInterval,
  Currency,
  MonetaryAmount,
  PaymentProcess,
  LanguageCode,
  DeactivationReason,
  SubscriptionStatus,
  KeyValue,
  PackageTag,
  PackageCustomizationConfig,
  SubscriptionChargeResult,
  SchemaDefinition,
  Query,
  Mutation,
  Package,
  Donation,
  Subscription,
  ListMetadata,
  ChargableSubscription
];

export default makeExecutableSchema({ typeDefs, resolvers });
