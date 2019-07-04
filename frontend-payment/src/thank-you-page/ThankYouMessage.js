import React, { useContext } from "react";

import { TranslationContext } from "../translations";
import { paydaOrange } from "../constants";

const headingStyle = { textAlign: "center", color: paydaOrange };

const Title = () => {
  const { translate } = useContext(TranslationContext);

  return (
    <div>
      <h1 style={{ ...headingStyle }}>{translate("thank_you_page_title")}</h1>
      <h4 style={{ ...headingStyle }}>
        {translate("thank_you_page_description")}
      </h4>
      <h4 style={{ ...headingStyle }}>{translate("thank_you_page_contact")}</h4>
    </div>
  );
};

export default Title;
