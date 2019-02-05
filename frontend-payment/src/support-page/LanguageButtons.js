import React, { useContext } from "react";

import { TranslationContext } from "../translations";
import { LANG_CODES } from "../constants";

const LanguageButton = ({ langCode }) => {
  const { dispatch } = useContext(TranslationContext);

  const actionType = langCode === LANG_CODES.TR ? "setTurkish" : "setEnglish";

  return (
    <button onClick={() => dispatch({ type: actionType })}>{langCode}</button>
  );
};

const LanguageButtons = props => {
  return (
    <>
      <LanguageButton langCode={LANG_CODES.TR} />
      <LanguageButton langCode={LANG_CODES.EN} />
    </>
  );
};

export default LanguageButtons;
