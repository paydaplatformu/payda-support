import React from "react";

import en from "./en.json";
import tr from "./tr.json";

export const TR = "TR";
export const EN = "EN";

const __translate = (langCode, translationKey) => {
  switch (langCode) {
    case TR:
      return en[translationKey];
    case EN:
      return tr[translationKey];
    default:
      return translationKey;
  }
};

export const TranslationContext = React.createContext();
