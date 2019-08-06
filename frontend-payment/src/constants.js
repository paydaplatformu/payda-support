export const paydaOrange = "rgba(245, 145, 48, 1)";
export const baseURL =
  localStorage.getItem("baseURL") || "https://support.paydaplatformu.org";

export const REPEAT_INTERVAL = {
  NONE: "NONE",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
  TEST_A: "TEST_A",
  TEST_B: "TEST_B"
};

export const SUBSCRIPTION_STATUS = {
  CREATED: "CREATED",
  RUNNING: "RUNNING",
  CANCELLED: "CANCELLED"
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
  YEARLY: "recurring_yearly",
  TEST_A: "recurring_a",
  TEST_B: "recurring_b"
};

export const REPEAT_INTERVAL_TRANSLATION_KEYS = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
  NONE: "non_recurrent",
  TEST_A: "recurring_a",
  TEST_B: "recurring_b"
};
