import React, { useState, useContext } from "react";
import { Modal, Collapse } from "antd";

import { paydaOrange } from "../../../../constants";
import { TranslationContext } from "../../../../translations";
import { getPackageName, getPackageDescription } from "../../../../utils";
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
        <Collapse bordered={false}>
          {packages &&
            packages.map(pack => (
              <Collapse.Panel
                key={pack.id}
                header={<b>{getPackageName(pack, langCode)}</b>}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <img src={pack.image} alt={getPackageName(pack, langCode)} />
                  <div style={{ marginTop: 20 }}>
                    {getPackageDescription(pack, langCode)}
                  </div>
                </div>
              </Collapse.Panel>
            ))}
        </Collapse>
      </Modal>
    </>
  );
};

export default PackageDetails;
