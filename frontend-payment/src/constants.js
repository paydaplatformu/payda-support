export const paydaOrange = "rgba(245, 145, 48, 1)";
export const baseURL =
  localStorage.getItem("baseURL") || "https://payda-support-v2.herokuapp.com";

export const REPEAT_CONFIG = {
  NONE: "NONE",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY"
};

export const CURRENCY = {
  TRY: "TRY",
  USD: "USD"
};

export const LANG_CODES = {
  TR: "tr",
  EN: "en"
};

export const RECURRENCY_TRANSLATION_KEYS = {
  MONTHLY: "recurring_monthly",
  YEARLY: "recurring_yearly"
};

export const REPEAT_INTERVAL_TRANSLATION_KEYS = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
  NONE: "non_recurrent"
};
