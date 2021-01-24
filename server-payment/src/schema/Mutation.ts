import { gql } from "apollo-server-core";
import { MutationResolvers } from "../generated/graphql";
import { AuthenticationRequired } from "../models/Errors";
import { PackageModifier, PackageCreator } from "../models/Package";
import { DonationCreator } from "../models/Donation";

export function isDefined<T>(value: T | undefined | null): value is T {
  return <T>value !== undefined && <T>value !== null;
}

export const typeDef = gql`
  type Mutation {
    createPackage(
      defaultTag: PackageTagInput!
      recurrenceConfig: PackageRecurrenceConfigInput!
      customizationConfig: PackageCustomizationConfigInput!
      reference: String
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
  }
`;

export const resolvers: MutationResolvers = {
  createPackage: (parent, args, { packageService, user }) => {
    if (!user) throw new AuthenticationRequired();
    const creator: PackageCreator = {
      ...args,
      isCustom: false,
      tags: args.tags || [],
    };
    return packageService.create(creator);
  },
  updatePackage: async (parent, args, { packageService, user }) => {
    if (!user) throw new AuthenticationRequired();
    const current = await packageService.getById(args.id);
    if (!current) throw new Error("Package not found");
    const modifier: Partial<PackageModifier> = {
      isActive: isDefined(args.isActive) ? args.isActive : current.isActive,
      customizationConfig: isDefined(args.customizationConfig) ? args.customizationConfig : current.customizationConfig,
      priority: isDefined(args.priority) ? args.priority : current.priority,
      tags: isDefined(args.tags) ? args.tags : current.tags,
      defaultTag: isDefined(args.defaultTag) ? args.defaultTag : current.defaultTag,
      reference: args.reference === null ? null : args.reference,
      image: args.image === null ? null : args.image,
    };
    return packageService.edit(args.id, modifier);
  },
  createDonation: async (parent, { donationInput, language }, { donationManagerService, ip }) => {
    const donationCreator: DonationCreator = {
      ...donationInput,
      ip,
    };
    return donationManagerService.createDonation(donationCreator, language);
  },
  cleanPendingDonations: (parent, args, { donationService, user }) => {
    if (!user) throw new AuthenticationRequired();
    return donationService.cleanPendingDonations();
  },
};
