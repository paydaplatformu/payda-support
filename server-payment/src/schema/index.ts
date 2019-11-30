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
import { resolvers as queryResolver, typeDef as Query } from "./Query";
import { resolvers as mutationResolver, typeDef as Mutation } from "./Mutation";
import { makeExecutableSchema } from "graphql-tools";
import { SchemaDefinition } from "./SchemaDefinition";

const resolvers = {
  Query: queryResolver,
  Mutation: mutationResolver,
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
