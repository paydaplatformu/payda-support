import { gql } from "apollo-server-core";
import { IResolvers } from "graphql-tools";
import { SubscriptionModel } from "../models/Subscription";
import { IContext } from "./context";

export const typeDef = gql`
  input SubscriptionFilter {
    ids: [String!]
    status: SubscriptionStatus
    repeatInterval: RepeatInterval
    hasPaymentToken: Boolean
  }

  type Subscription {
    id: String!
    packageId: String!

    "Original donation made by the user"
    donationId: String!

    processHistory: [PaymentProcess!]!
    deactivationReason: DeactivationReason
    hasPaymentToken: Boolean!
    status: SubscriptionStatus!
    createdAt: Date!
    updatedAt: Date!
  }
`;

export const resolvers: IResolvers<SubscriptionModel, IContext> = {
  Subscription: {}
};
