import {
  RECURRENCY_TRANSLATION_KEYS,
  REPEAT_CONFIG,
  CURRENCY
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

export const isPackageRecurrent = repeatConfig => repeatConfig !== "NONE";

export const getPackageRecurrencyTranslationKey = repeatConfig =>
  RECURRENCY_TRANSLATION_KEYS[repeatConfig];

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

export const repeatConfigChoices = [
  { id: REPEAT_CONFIG.NONE, name: "None" },
  { id: REPEAT_CONFIG.MONTHLY, name: "Monthly" },
  { id: REPEAT_CONFIG.YEARLY, name: "Yearly" }
];

export const currencyChoices = [
  [{ id: CURRENCY.TRY, name: "TRY" }, { id: CURRENCY.USD, name: "USD" }]
];
