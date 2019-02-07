import React, { useContext } from "react";
import { TranslationContext } from "../translations";

const headingStyle = { textAlign: "center", color: "#ffffff" };

const Title = () => {
  const { translate } = useContext(TranslationContext);

  return (
    <div>
      <h1 style={{ ...headingStyle, fontSize: 36 }}>
        {translate("support_page_title")}
      </h1>
      <h4 style={{ ...headingStyle, fontSize: 18 }}>
        {translate("support_page_description")}
      </h4>
    </div>
  );
};

export default Title;
