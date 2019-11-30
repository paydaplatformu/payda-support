import { gql } from "apollo-server-core";
import { MutationResolvers } from "../generated/graphql";
import { AuthenticationRequired } from "../models/Errors";
import { PackageModifier, PackageCreator } from "../models/Package";
import { DonationCreator } from "../models/Donation";

export const typeDef = gql`
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
      isActive: Boolean
      customizationConfig: PackageCustomizationConfigInput
      reference: String
      image: String
      priority: Int
      tags: [PackageTagInput!]
    ): Package

    createDonation(donationInput: DonationInput!, language: LanguageCode!): DonationCreationResult!
    cleanPendingDonations: Int!

    updateSubscription(id: String!, status: SubscriptionStatus!): Subscription

    chargeSubscription(id: String!): SubscriptionChargeResult!

    cancelSubscription(id: String!): Subscription
  }
`;

export const resolvers: MutationResolvers = {
  createPackage: (parent, args, { packageService, user }) => {
    if (!user) throw new AuthenticationRequired();
    const creator: PackageCreator = {
      defaultTag: args.defaultTag,
      reference: args.reference,
      repeatInterval: args.repeatInterval,
      image: args.image,
      price: args.price,
      customizationConfig: args.customizationConfig,
      isCustom: false,
      priority: args.priority,
      tags: args.tags || []
    };
    return packageService.create(creator);
  },
  updatePackage: (parent, args, { packageService, user }) => {
    if (!user) throw new AuthenticationRequired();
    const modifier: Partial<PackageModifier> = {
      defaultTag: args.defaultTag || undefined
    };
    return packageService.edit(args.id, modifier);
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

  updateSubscription: (parent, modifier, { subscriptionService, user }) => {
    if (!user) throw new AuthenticationRequired();
    return subscriptionService.edit(modifier.id, { status: modifier.status });
  },

  chargeSubscription: (parent, { id }, { payuService, user }) => {
    if (!user) throw new AuthenticationRequired();
    return payuService.chargeUsingToken(id);
  },

  cancelSubscription: (parent, { id }, { subscriptionService, user }) => {
    if (!user) throw new AuthenticationRequired();
    return subscriptionService.cancelSubscription(id);
  }
};
