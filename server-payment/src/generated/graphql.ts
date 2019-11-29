import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql";
import { RunningSubscription } from "./../models/Subscription";
import { IContext } from "../schema/context";
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date scalar type */
  Date: Date;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type ChargableSubscription = {
  readonly __typename?: "ChargableSubscription";
  readonly id: Scalars["String"];
  readonly packageId: Scalars["String"];
  /** The language user chose while starting the subscription. Helpful for communicating with the user */
  readonly language: LanguageCode;
  /** Original donation made by the user */
  readonly donationId: Scalars["String"];
  readonly processHistory: ReadonlyArray<PaymentProcess>;
  readonly deactivationReason: Maybe<DeactivationReason>;
  readonly hasPaymentToken: Scalars["Boolean"];
  readonly status: SubscriptionStatus;
  readonly createdAt: Scalars["Date"];
  readonly updatedAt: Scalars["Date"];
};

export enum Currency {
  Usd = "USD",
  Try = "TRY"
}

export enum DeactivationReason {
  Error = "ERROR",
  UserRequest = "USER_REQUEST"
}

export type Donation = {
  readonly __typename?: "Donation";
  readonly id: Scalars["String"];
  readonly fullName: Scalars["String"];
  readonly email: Scalars["String"];
  readonly packageId: Scalars["String"];
  readonly notes: Maybe<Scalars["String"]>;
  readonly paymentConfirmed: Scalars["Boolean"];
  readonly date: Scalars["Date"];
  readonly usingAmex: Scalars["Boolean"];
  readonly quantity: Scalars["Int"];
  /** If the donation is created because of a subscription, this will point to the original user donation */
  readonly parentDonationId: Maybe<Scalars["String"]>;
};

export type DonationCreationResult = {
  readonly __typename?: "DonationCreationResult";
  readonly donation: Donation;
  readonly package: Package;
  readonly subscription: Maybe<Subscription>;
  readonly formUrl: Scalars["String"];
  readonly formFields: ReadonlyArray<KeyValue>;
};

export type DonationFilter = {
  readonly paymentConfirmed: Maybe<Scalars["Boolean"]>;
  readonly search: Maybe<Scalars["String"]>;
  readonly ids: Maybe<ReadonlyArray<Scalars["String"]>>;
  readonly packageId: Maybe<Scalars["String"]>;
  /** If true only shows donations that was created by user, excluding automated subscriptions */
  readonly onlyDirect: Maybe<Scalars["Boolean"]>;
};

export type DonationInput = {
  readonly fullName: Scalars["String"];
  readonly email: Scalars["String"];
  readonly packageId: Scalars["String"];
  readonly customPriceAmount: Maybe<Scalars["Float"]>;
  readonly customPriceCurrency: Maybe<Currency>;
  readonly customRepeatInterval: Maybe<RepeatInterval>;
  readonly notes: Maybe<Scalars["String"]>;
  readonly quantity: Scalars["Int"];
  readonly usingAmex: Scalars["Boolean"];
};

export type KeyValue = {
  readonly __typename?: "KeyValue";
  readonly key: Scalars["String"];
  readonly value: Scalars["String"];
};

export enum LanguageCode {
  Tr = "TR",
  En = "EN"
}

export type ListMetadata = {
  readonly __typename?: "ListMetadata";
  readonly count: Scalars["Int"];
};

export type MonetaryAmount = {
  readonly __typename?: "MonetaryAmount";
  readonly currency: Currency;
  readonly amount: Scalars["Float"];
};

export type MonetaryAmountInput = {
  readonly currency: Currency;
  readonly amount: Scalars["Float"];
};

export type Mutation = {
  readonly __typename?: "Mutation";
  readonly createPackage: Package;
  readonly updatePackage: Maybe<Package>;
  readonly createDonation: DonationCreationResult;
  readonly cleanPendingDonations: Scalars["Int"];
  readonly updateSubscription: Maybe<Subscription>;
  readonly chargeSubscription: SubscriptionChargeResult;
  readonly cancelSubscription: Maybe<Subscription>;
};

export type MutationCreatePackageArgs = {
  defaultTag: PackageTagInput;
  customizationConfig: PackageCustomizationConfigInput;
  reference: Maybe<Scalars["String"]>;
  repeatInterval: RepeatInterval;
  image: Maybe<Scalars["String"]>;
  price: MonetaryAmountInput;
  priority: Scalars["Int"];
  tags: Maybe<ReadonlyArray<PackageTagInput>>;
};

export type MutationUpdatePackageArgs = {
  id: Scalars["String"];
  defaultTag: Maybe<PackageTagInput>;
  isActive: Maybe<Scalars["Boolean"]>;
  customizationConfig: Maybe<PackageCustomizationConfigInput>;
  reference: Maybe<Scalars["String"]>;
  image: Maybe<Scalars["String"]>;
  priority: Maybe<Scalars["Int"]>;
  tags: Maybe<ReadonlyArray<PackageTagInput>>;
};

export type MutationCreateDonationArgs = {
  donationInput: DonationInput;
  language: LanguageCode;
};

export type MutationUpdateSubscriptionArgs = {
  id: Scalars["String"];
  status: SubscriptionStatus;
};

export type MutationChargeSubscriptionArgs = {
  id: Scalars["String"];
};

export type MutationCancelSubscriptionArgs = {
  id: Scalars["String"];
};

export type Package = {
  readonly __typename?: "Package";
  readonly id: Scalars["String"];
  readonly defaultTag: PackageTag;
  readonly reference: Maybe<Scalars["String"]>;
  readonly createdAt: Scalars["Date"];
  readonly updatedAt: Scalars["Date"];
  readonly repeatInterval: RepeatInterval;
  readonly donationCount: Scalars["Int"];
  readonly image: Maybe<Scalars["String"]>;
  readonly price: MonetaryAmount;
  readonly customizationConfig: PackageCustomizationConfig;
  readonly isCustom: Scalars["Boolean"];
  readonly priority: Scalars["Int"];
  readonly tags: ReadonlyArray<PackageTag>;
  readonly isActive: Scalars["Boolean"];
};

export type PackageCustomizationConfig = {
  readonly __typename?: "PackageCustomizationConfig";
  readonly allowPriceAmountCustomization: Scalars["Boolean"];
  readonly allowPriceCurrencyCustomization: Scalars["Boolean"];
  readonly allowRepeatIntervalCustomization: Scalars["Boolean"];
};

export type PackageCustomizationConfigInput = {
  readonly allowPriceAmountCustomization: Scalars["Boolean"];
  readonly allowPriceCurrencyCustomization: Scalars["Boolean"];
  readonly allowRepeatIntervalCustomization: Scalars["Boolean"];
};

export type PackageFilter = {
  readonly ids: Maybe<ReadonlyArray<Scalars["String"]>>;
  readonly onlyActive: Maybe<Scalars["Boolean"]>;
  readonly onlyOriginal: Maybe<Scalars["Boolean"]>;
  readonly repeatInterval: Maybe<RepeatInterval>;
  readonly amount: Maybe<Scalars["Float"]>;
  readonly currency: Maybe<Currency>;
  readonly search: Maybe<Scalars["String"]>;
};

export type PackageTag = {
  readonly __typename?: "PackageTag";
  readonly code: LanguageCode;
  readonly name: Scalars["String"];
  readonly description: Maybe<Scalars["String"]>;
};

export type PackageTagInput = {
  readonly code: LanguageCode;
  readonly name: Scalars["String"];
  readonly description: Maybe<Scalars["String"]>;
};

export type PaymentProcess = {
  readonly __typename?: "PaymentProcess";
  readonly date: Scalars["Date"];
  readonly result: Maybe<Scalars["JSON"]>;
  readonly isSuccess: Scalars["Boolean"];
};

export type Query = {
  readonly __typename?: "Query";
  readonly Package: Maybe<Package>;
  readonly allPackages: ReadonlyArray<Package>;
  readonly _allPackagesMeta: Maybe<ListMetadata>;
  readonly Donation: Maybe<Donation>;
  readonly allDonations: ReadonlyArray<Donation>;
  readonly _allDonationsMeta: Maybe<ListMetadata>;
  readonly Subscription: Maybe<Subscription>;
  readonly allSubscriptions: ReadonlyArray<Subscription>;
  readonly _allSubscriptionsMeta: Maybe<ListMetadata>;
  readonly ChargableSubscription: Maybe<ChargableSubscription>;
  readonly allChargableSubscriptions: ReadonlyArray<ChargableSubscription>;
  readonly _allChargableSubscriptionsMeta: Maybe<ListMetadata>;
};

export type QueryPackageArgs = {
  id: Scalars["String"];
};

export type QueryAllPackagesArgs = {
  page: Maybe<Scalars["Int"]>;
  perPage: Maybe<Scalars["Int"]>;
  sortField: Maybe<Scalars["String"]>;
  sortOrder: Maybe<Scalars["String"]>;
  filter: Maybe<PackageFilter>;
};

export type Query_AllPackagesMetaArgs = {
  page: Maybe<Scalars["Int"]>;
  perPage: Maybe<Scalars["Int"]>;
  sortField: Maybe<Scalars["String"]>;
  sortOrder: Maybe<Scalars["String"]>;
  filter: Maybe<PackageFilter>;
};

export type QueryDonationArgs = {
  id: Scalars["String"];
};

export type QueryAllDonationsArgs = {
  page: Maybe<Scalars["Int"]>;
  perPage: Maybe<Scalars["Int"]>;
  sortField: Maybe<Scalars["String"]>;
  sortOrder: Maybe<Scalars["String"]>;
  filter: Maybe<DonationFilter>;
};

export type Query_AllDonationsMetaArgs = {
  page: Maybe<Scalars["Int"]>;
  perPage: Maybe<Scalars["Int"]>;
  sortField: Maybe<Scalars["String"]>;
  sortOrder: Maybe<Scalars["String"]>;
  filter: Maybe<DonationFilter>;
};

export type QuerySubscriptionArgs = {
  id: Scalars["String"];
};

export type QueryAllSubscriptionsArgs = {
  page: Maybe<Scalars["Int"]>;
  perPage: Maybe<Scalars["Int"]>;
  sortField: Maybe<Scalars["String"]>;
  sortOrder: Maybe<Scalars["String"]>;
  filter: Maybe<SubscriptionFilter>;
};

export type Query_AllSubscriptionsMetaArgs = {
  page: Maybe<Scalars["Int"]>;
  perPage: Maybe<Scalars["Int"]>;
  sortField: Maybe<Scalars["String"]>;
  sortOrder: Maybe<Scalars["String"]>;
  filter: Maybe<SubscriptionFilter>;
};

export type QueryChargableSubscriptionArgs = {
  id: Scalars["String"];
};

export type QueryAllChargableSubscriptionsArgs = {
  page: Maybe<Scalars["Int"]>;
  perPage: Maybe<Scalars["Int"]>;
  sortField: Maybe<Scalars["String"]>;
  sortOrder: Maybe<Scalars["String"]>;
  filter: SubscriptionFilter;
};

export type Query_AllChargableSubscriptionsMetaArgs = {
  page: Maybe<Scalars["Int"]>;
  perPage: Maybe<Scalars["Int"]>;
  sortField: Maybe<Scalars["String"]>;
  sortOrder: Maybe<Scalars["String"]>;
  filter: SubscriptionFilter;
};

export enum RepeatInterval {
  None = "NONE",
  Monthly = "MONTHLY",
  Yearly = "YEARLY",
  TestA = "TEST_A",
  TestB = "TEST_B"
}

export type Subscription = {
  readonly __typename?: "Subscription";
  readonly id: Scalars["String"];
  readonly packageId: Scalars["String"];
  /** The language user chose while starting the subscription. Helpful for communicating with the user */
  readonly language: LanguageCode;
  /** Original donation made by the user */
  readonly donationId: Scalars["String"];
  readonly processHistory: ReadonlyArray<PaymentProcess>;
  readonly deactivationReason: Maybe<DeactivationReason>;
  readonly hasPaymentToken: Scalars["Boolean"];
  readonly status: SubscriptionStatus;
  readonly createdAt: Scalars["Date"];
  readonly updatedAt: Scalars["Date"];
};

export type SubscriptionChargeResult = {
  readonly __typename?: "SubscriptionChargeResult";
  readonly status: Scalars["Boolean"];
  readonly body: Scalars["String"];
};

export type SubscriptionFilter = {
  readonly ids: Maybe<ReadonlyArray<Scalars["String"]>>;
  readonly status: Maybe<SubscriptionStatus>;
  readonly repeatInterval: RepeatInterval;
  readonly hasPaymentToken: Maybe<Scalars["Boolean"]>;
};

export enum SubscriptionStatus {
  Created = "CREATED",
  Running = "RUNNING",
  Cancelled = "CANCELLED"
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Package: ResolverTypeWrapper<Package>;
  PackageTag: ResolverTypeWrapper<PackageTag>;
  LanguageCode: LanguageCode;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
  RepeatInterval: RepeatInterval;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  MonetaryAmount: ResolverTypeWrapper<MonetaryAmount>;
  Currency: Currency;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  PackageCustomizationConfig: ResolverTypeWrapper<PackageCustomizationConfig>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  PackageFilter: PackageFilter;
  ListMetadata: ResolverTypeWrapper<ListMetadata>;
  Donation: ResolverTypeWrapper<Donation>;
  DonationFilter: DonationFilter;
  Subscription: ResolverTypeWrapper<{}>;
  PaymentProcess: ResolverTypeWrapper<PaymentProcess>;
  JSON: ResolverTypeWrapper<Scalars["JSON"]>;
  DeactivationReason: DeactivationReason;
  SubscriptionStatus: SubscriptionStatus;
  SubscriptionFilter: SubscriptionFilter;
  ChargableSubscription: ResolverTypeWrapper<RunningSubscription>;
  Mutation: ResolverTypeWrapper<{}>;
  PackageTagInput: PackageTagInput;
  PackageCustomizationConfigInput: PackageCustomizationConfigInput;
  MonetaryAmountInput: MonetaryAmountInput;
  DonationInput: DonationInput;
  DonationCreationResult: ResolverTypeWrapper<DonationCreationResult>;
  KeyValue: ResolverTypeWrapper<KeyValue>;
  SubscriptionChargeResult: ResolverTypeWrapper<SubscriptionChargeResult>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  String: Scalars["String"];
  Package: Package;
  PackageTag: PackageTag;
  LanguageCode: LanguageCode;
  Date: Scalars["Date"];
  RepeatInterval: RepeatInterval;
  Int: Scalars["Int"];
  MonetaryAmount: MonetaryAmount;
  Currency: Currency;
  Float: Scalars["Float"];
  PackageCustomizationConfig: PackageCustomizationConfig;
  Boolean: Scalars["Boolean"];
  PackageFilter: PackageFilter;
  ListMetadata: ListMetadata;
  Donation: Donation;
  DonationFilter: DonationFilter;
  Subscription: {};
  PaymentProcess: PaymentProcess;
  JSON: Scalars["JSON"];
  DeactivationReason: DeactivationReason;
  SubscriptionStatus: SubscriptionStatus;
  SubscriptionFilter: SubscriptionFilter;
  ChargableSubscription: RunningSubscription;
  Mutation: {};
  PackageTagInput: PackageTagInput;
  PackageCustomizationConfigInput: PackageCustomizationConfigInput;
  MonetaryAmountInput: MonetaryAmountInput;
  DonationInput: DonationInput;
  DonationCreationResult: DonationCreationResult;
  KeyValue: KeyValue;
  SubscriptionChargeResult: SubscriptionChargeResult;
}>;

export type ChargableSubscriptionResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["ChargableSubscription"] = ResolversParentTypes["ChargableSubscription"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  packageId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  language?: Resolver<ResolversTypes["LanguageCode"], ParentType, ContextType>;
  donationId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  processHistory?: Resolver<ReadonlyArray<ResolversTypes["PaymentProcess"]>, ParentType, ContextType>;
  deactivationReason?: Resolver<Maybe<ResolversTypes["DeactivationReason"]>, ParentType, ContextType>;
  hasPaymentToken?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["SubscriptionStatus"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export type DonationResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["Donation"] = ResolversParentTypes["Donation"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  fullName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  packageId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  paymentConfirmed?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  usingAmex?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  parentDonationId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
}>;

export type DonationCreationResultResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["DonationCreationResult"] = ResolversParentTypes["DonationCreationResult"]
> = ResolversObject<{
  donation?: Resolver<ResolversTypes["Donation"], ParentType, ContextType>;
  package?: Resolver<ResolversTypes["Package"], ParentType, ContextType>;
  subscription?: Resolver<Maybe<ResolversTypes["Subscription"]>, ParentType, ContextType>;
  formUrl?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  formFields?: Resolver<ReadonlyArray<ResolversTypes["KeyValue"]>, ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["JSON"], any> {
  name: "JSON";
}

export type KeyValueResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["KeyValue"] = ResolversParentTypes["KeyValue"]
> = ResolversObject<{
  key?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  value?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type ListMetadataResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["ListMetadata"] = ResolversParentTypes["ListMetadata"]
> = ResolversObject<{
  count?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
}>;

export type MonetaryAmountResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["MonetaryAmount"] = ResolversParentTypes["MonetaryAmount"]
> = ResolversObject<{
  currency?: Resolver<ResolversTypes["Currency"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = ResolversObject<{
  createPackage?: Resolver<
    ResolversTypes["Package"],
    ParentType,
    ContextType,
    RequireFields<
      MutationCreatePackageArgs,
      "defaultTag" | "customizationConfig" | "repeatInterval" | "price" | "priority"
    >
  >;
  updatePackage?: Resolver<
    Maybe<ResolversTypes["Package"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePackageArgs, "id">
  >;
  createDonation?: Resolver<
    ResolversTypes["DonationCreationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateDonationArgs, "donationInput" | "language">
  >;
  cleanPendingDonations?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  updateSubscription?: Resolver<
    Maybe<ResolversTypes["Subscription"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateSubscriptionArgs, "id" | "status">
  >;
  chargeSubscription?: Resolver<
    ResolversTypes["SubscriptionChargeResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChargeSubscriptionArgs, "id">
  >;
  cancelSubscription?: Resolver<
    Maybe<ResolversTypes["Subscription"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCancelSubscriptionArgs, "id">
  >;
}>;

export type PackageResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["Package"] = ResolversParentTypes["Package"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  defaultTag?: Resolver<ResolversTypes["PackageTag"], ParentType, ContextType>;
  reference?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  repeatInterval?: Resolver<ResolversTypes["RepeatInterval"], ParentType, ContextType>;
  donationCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes["MonetaryAmount"], ParentType, ContextType>;
  customizationConfig?: Resolver<ResolversTypes["PackageCustomizationConfig"], ParentType, ContextType>;
  isCustom?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  tags?: Resolver<ReadonlyArray<ResolversTypes["PackageTag"]>, ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
}>;

export type PackageCustomizationConfigResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["PackageCustomizationConfig"] = ResolversParentTypes["PackageCustomizationConfig"]
> = ResolversObject<{
  allowPriceAmountCustomization?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  allowPriceCurrencyCustomization?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  allowRepeatIntervalCustomization?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
}>;

export type PackageTagResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["PackageTag"] = ResolversParentTypes["PackageTag"]
> = ResolversObject<{
  code?: Resolver<ResolversTypes["LanguageCode"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
}>;

export type PaymentProcessResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["PaymentProcess"] = ResolversParentTypes["PaymentProcess"]
> = ResolversObject<{
  date?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  isSuccess?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  Package?: Resolver<Maybe<ResolversTypes["Package"]>, ParentType, ContextType, RequireFields<QueryPackageArgs, "id">>;
  allPackages?: Resolver<ReadonlyArray<ResolversTypes["Package"]>, ParentType, ContextType, QueryAllPackagesArgs>;
  _allPackagesMeta?: Resolver<
    Maybe<ResolversTypes["ListMetadata"]>,
    ParentType,
    ContextType,
    Query_AllPackagesMetaArgs
  >;
  Donation?: Resolver<
    Maybe<ResolversTypes["Donation"]>,
    ParentType,
    ContextType,
    RequireFields<QueryDonationArgs, "id">
  >;
  allDonations?: Resolver<ReadonlyArray<ResolversTypes["Donation"]>, ParentType, ContextType, QueryAllDonationsArgs>;
  _allDonationsMeta?: Resolver<
    Maybe<ResolversTypes["ListMetadata"]>,
    ParentType,
    ContextType,
    Query_AllDonationsMetaArgs
  >;
  Subscription?: Resolver<
    Maybe<ResolversTypes["Subscription"]>,
    ParentType,
    ContextType,
    RequireFields<QuerySubscriptionArgs, "id">
  >;
  allSubscriptions?: Resolver<
    ReadonlyArray<ResolversTypes["Subscription"]>,
    ParentType,
    ContextType,
    QueryAllSubscriptionsArgs
  >;
  _allSubscriptionsMeta?: Resolver<
    Maybe<ResolversTypes["ListMetadata"]>,
    ParentType,
    ContextType,
    Query_AllSubscriptionsMetaArgs
  >;
  ChargableSubscription?: Resolver<
    Maybe<ResolversTypes["ChargableSubscription"]>,
    ParentType,
    ContextType,
    RequireFields<QueryChargableSubscriptionArgs, "id">
  >;
  allChargableSubscriptions?: Resolver<
    ReadonlyArray<ResolversTypes["ChargableSubscription"]>,
    ParentType,
    ContextType,
    RequireFields<QueryAllChargableSubscriptionsArgs, "filter">
  >;
  _allChargableSubscriptionsMeta?: Resolver<
    Maybe<ResolversTypes["ListMetadata"]>,
    ParentType,
    ContextType,
    RequireFields<Query_AllChargableSubscriptionsMetaArgs, "filter">
  >;
}>;

export type SubscriptionResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"]
> = ResolversObject<{
  id?: SubscriptionResolver<ResolversTypes["String"], "id", ParentType, ContextType>;
  packageId?: SubscriptionResolver<ResolversTypes["String"], "packageId", ParentType, ContextType>;
  language?: SubscriptionResolver<ResolversTypes["LanguageCode"], "language", ParentType, ContextType>;
  donationId?: SubscriptionResolver<ResolversTypes["String"], "donationId", ParentType, ContextType>;
  processHistory?: SubscriptionResolver<
    ReadonlyArray<ResolversTypes["PaymentProcess"]>,
    "processHistory",
    ParentType,
    ContextType
  >;
  deactivationReason?: SubscriptionResolver<
    Maybe<ResolversTypes["DeactivationReason"]>,
    "deactivationReason",
    ParentType,
    ContextType
  >;
  hasPaymentToken?: SubscriptionResolver<ResolversTypes["Boolean"], "hasPaymentToken", ParentType, ContextType>;
  status?: SubscriptionResolver<ResolversTypes["SubscriptionStatus"], "status", ParentType, ContextType>;
  createdAt?: SubscriptionResolver<ResolversTypes["Date"], "createdAt", ParentType, ContextType>;
  updatedAt?: SubscriptionResolver<ResolversTypes["Date"], "updatedAt", ParentType, ContextType>;
}>;

export type SubscriptionChargeResultResolvers<
  ContextType = IContext,
  ParentType extends ResolversParentTypes["SubscriptionChargeResult"] = ResolversParentTypes["SubscriptionChargeResult"]
> = ResolversObject<{
  status?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  body?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = IContext> = ResolversObject<{
  ChargableSubscription?: ChargableSubscriptionResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Donation?: DonationResolvers<ContextType>;
  DonationCreationResult?: DonationCreationResultResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  KeyValue?: KeyValueResolvers<ContextType>;
  ListMetadata?: ListMetadataResolvers<ContextType>;
  MonetaryAmount?: MonetaryAmountResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Package?: PackageResolvers<ContextType>;
  PackageCustomizationConfig?: PackageCustomizationConfigResolvers<ContextType>;
  PackageTag?: PackageTagResolvers<ContextType>;
  PaymentProcess?: PaymentProcessResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SubscriptionChargeResult?: SubscriptionChargeResultResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = IContext> = Resolvers<ContextType>;
