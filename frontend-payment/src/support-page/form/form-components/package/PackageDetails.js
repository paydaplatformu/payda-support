import React, { useState, useContext } from "react";
import { Modal } from "antd";

import { paydaOrange } from "../../../../constants";
import { TranslationContext } from "../../../../translations";
import { getPackageNameAndDescription } from "../../../../utils";
import { PackageContext } from "./PackageContext";

const modalLinkStyles = {
  padding: 0,
  color: paydaOrange,
  textDecoration: "underline",
  cursor: "pointer",
};

const PackageDetails = props => {
  const [visible, setVisible] = useState(false);
  const { translate, langCode } = useContext(TranslationContext);
  const { packages } = useContext(PackageContext);

  return (
    <>
      <span
        style={modalLinkStyles}
        onClick={() => setVisible(true)}
      >{`* ${translate("package_details")}`}</span>
      <Modal visible={visible} onCancel={() => setVisible(false)} footer={null}>
        {packages &&
          packages.map(pack => (
            <div key={pack.id} style={{ margin: "10px 0" }}>
              <img
                src={pack.image}
                alt={getPackageNameAndDescription(pack, langCode)}
              />
              {getPackageNameAndDescription(pack, langCode)}
            </div>
          ))}
      </Modal>
    </>
  );
};

export default PackageDetails;
