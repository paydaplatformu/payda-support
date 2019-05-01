import {
  RECURRENCY_TRANSLATION_KEYS,
  REPEAT_INTERVAL,
  CURRENCY,
  SUBSCRIPTION_STATUS
} from "./constants";

export const getPackageTag = (pack, langCode) =>
  (pack.tags && pack.tags.find(tag => tag.code === langCode.toUpperCase())) ||
  pack.defaultTag;

export const getPackageName = (pack, langCode) => {
  const packageTag = getPackageTag(pack, langCode);

  return packageTag.name;
};

export const getPackageDescription = (pack, langCode) => {
  const packageTag = getPackageTag(pack, langCode);

  return packageTag.description;
};

export const getPackageHasDescription = (pack, langCode) =>
  !!getPackageDescription(pack, langCode);

export const getPackagePriceText = pack => {
  const packagePrice = pack.price;

  if (!packagePrice) return null;

  return `${packagePrice.amount}${packagePrice.currency}`;
};

export const isPackageRecurrent = repeatInterval => repeatInterval !== "NONE";

export const getPackageRecurrencyTranslationKey = repeatInterval =>
  RECURRENCY_TRANSLATION_KEYS[repeatInterval];

export const defaultDateFieldProps = {
  options: {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "Europe/Istanbul"
  }
};

export const repeatIntervalChoices = [
  { id: REPEAT_INTERVAL.NONE, name: "None" },
  ...activeRepeatIntervalChoices
];

export const activeRepeatIntervalChoices = [
  { id: REPEAT_INTERVAL.MONTHLY, name: "Monthly" },
  { id: REPEAT_INTERVAL.YEARLY, name: "Yearly" }
];

export const subscriptionStatusChoices = [
  { id: SUBSCRIPTION_STATUS.CREATED, name: "Created" },
  { id: SUBSCRIPTION_STATUS.RUNNING, name: "Running" },
  { id: SUBSCRIPTION_STATUS.CANCELLED, name: "Cancelled" }
];

export const currencyChoices = [
  { id: CURRENCY.TRY, name: "TRY" },
  { id: CURRENCY.USD, name: "USD" }
];

export const getSourceProp = element => {
  if (element.props.children)
    return `${element.props.source}.${element.props.children.props.source}`;
  return element.props.source;
};
