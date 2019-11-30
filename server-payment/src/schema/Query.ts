import { gql } from "apollo-server-core";
import { QueryResolvers } from "../generated/graphql";
import { AuthorizationError, AuthenticationRequired } from "../models/Errors";
import { isDefined } from "../utilities/helpers";
import { PaginationSettings } from "../models/PaginationSettings";

export const typeDef = gql`
  type Query {
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
      filter: SubscriptionFilter!
    ): [ChargableSubscription!]!
    _allChargableSubscriptionsMeta(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: SubscriptionFilter!
    ): ListMetadata
  }
`;

const getPaginationFromNullable = (page?: number | null, perPage?: number | null): PaginationSettings | null => {
  function isDefined<T>(value: T | undefined | null): value is T {
    return <T>value !== undefined && <T>value !== null;
  }

  return isDefined(page) && isDefined(perPage) ? { page, perPage } : null;
};

export const resolvers: QueryResolvers = {
  Package: (parent, { id }, { packageService }) => packageService.getById(id),
  allPackages: (parent, { filter, sortField, sortOrder, page, perPage }, { packageService, user }) => {
    if (!user && filter && filter.onlyActive === false)
      throw new AuthorizationError("Only admins can view non-active packages.");
    const pagination = getPaginationFromNullable(page, perPage);
    const sorting = { sortField, sortOrder };
    if (!user) return packageService.getAll(packageService.getDefaultFilters() || {}, null, sorting);
    return packageService.getAll(filter || {}, pagination, sorting);
  },
  _allPackagesMeta: async (parent, { filter }, { packageService, user }) => {
    if (!user) throw new AuthenticationRequired();
    return { count: await packageService.count(filter || {}) };
  },

  Donation: (parent, { id }, { donationService, user }) => {
    if (!user) throw new AuthenticationRequired();
    return donationService.getById(id);
  },
  allDonations: (parent, { filter, sortField, sortOrder, page, perPage }, { donationService, user }) => {
    if (!user) throw new AuthenticationRequired();
    const pagination = getPaginationFromNullable(page, perPage);
    const sorting = { sortField, sortOrder };
    return donationService.getAll(filter || {}, pagination, sorting);
  },
  _allDonationsMeta: async (parent, { filter }, { donationService, user }) => {
    if (!user) throw new AuthenticationRequired();
    return { count: await donationService.count(filter || {}) };
  },

  Subscription: (parent, { id }, { subscriptionService, user }) => {
    if (!user) throw new AuthenticationRequired();
    return subscriptionService.getById(id);
  },
  allSubscriptions: (parent, { filter, sortField, sortOrder, page, perPage }, { subscriptionService, user }) => {
    if (!user) throw new AuthenticationRequired();
    const pagination = getPaginationFromNullable(page, perPage);
    const sorting = { sortField, sortOrder };
    return subscriptionService.getAll(filter || {}, pagination, sorting);
  },
  _allSubscriptionsMeta: async (parent, { filter }, { subscriptionService, user }) => {
    if (!user) throw new AuthenticationRequired();
    return { count: await subscriptionService.count(filter || {}) };
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
    const pagination = getPaginationFromNullable(page, perPage);
    const sorting = { sortField, sortOrder };
    return subscriptionManagerService.getChargableSubscriptions(filter, pagination, sorting);
  },
  _allChargableSubscriptionsMeta: async (parent, { filter }, { subscriptionManagerService, user }) => {
    if (!user) throw new AuthenticationRequired();
    return {
      count: await subscriptionManagerService.countChargableSubscriptions(filter)
    };
  }
};
