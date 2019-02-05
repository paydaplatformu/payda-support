import React, { useReducer } from "react";

import { LANG_CODES } from "../constants";

import en from "./en.json";
import tr from "./tr.json";

export const TranslationContext = React.createContext({
  langCode: LANG_CODES.TR,
  translate: key => tr[key] || key,
});

export function TranslationContextProvider({ children }) {
  const initalState = {
    langCode: LANG_CODES.TR,
    translate: key => tr[key] || key,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "setTurkish":
        return { ...initalState };
      case "setEnglish":
        return { langCode: LANG_CODES.EN, translate: key => en[key] || key };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initalState);

  return (
    <TranslationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TranslationContext.Provider>
  );
}
