import { gql } from "apollo-server-core";
import { IResolvers } from "graphql-tools";
import { ISubscription } from "../models/Subscription";
import { IContext } from "./context";

export const typeDef = gql`
  input SubscriptionFilter {
    ids: [String!]
    onlyActive: Boolean
  }

  type Subscription {
    id: String!
    packageId: String!
    donationId: String!
    processHistory: [PaymentProcess!]!
    deactivationReason: DeactivationReason
    status: SubscriptionStatus!
    createdAt: Date!
    updatedAt: Date!
  }
`;

export const resolvers: IResolvers<ISubscription, IContext> = {
  Subscription: {}
};
