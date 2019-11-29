import { gql } from "apollo-server-core";

export const Query = gql`
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
