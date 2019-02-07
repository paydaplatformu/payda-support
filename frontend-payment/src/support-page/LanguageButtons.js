import React, { useContext } from "react";

import { TranslationContext } from "../translations";
import { LANG_CODES } from "../constants";

import iconSrcTR from "..//static/icons/icon_tr.png";
import iconSrcEn from "..//static/icons/icon_en.png";

const buttonStyle = { background: "none", border: "none", cursor: "pointer" };

const LanguageButton = ({ langCode }) => {
  const { dispatch } = useContext(TranslationContext);

  const actionType = langCode === LANG_CODES.TR ? "setTurkish" : "setEnglish";
  const iconSrc = langCode === LANG_CODES.TR ? iconSrcTR : iconSrcEn;

  return (
    <button style={buttonStyle} onClick={() => dispatch({ type: actionType })}>
      <img src={iconSrc} alt={`icon ${langCode}`} />
    </button>
  );
};

const LanguageButtons = props => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <LanguageButton langCode={LANG_CODES.TR} />
      <LanguageButton langCode={LANG_CODES.EN} />
    </div>
  );
};

export default LanguageButtons;
