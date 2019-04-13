import { RECURRENCY_TRANSLATION_KEYS } from "./constants";

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
