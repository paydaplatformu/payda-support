import React from "react";

import { Modal } from "antd";

const ReturnPolicyModal = props => (
  <Modal
    title="İade Koşulları"
    visible={props.visible}
    onCancel={props.dismissModal}
    footer={null}
  >
    <p>
      www.paydaplatformu.org üzerinden herhangi bir ürün veya hizmet satışı
      yapılmamaktadır. Dolayısıyla herhangi bir ürün veya hizmetin iadesi söz
      konusu değildir.
    </p>
    <p>
      www.paydaplatformu.org üzerinden kullanıcılar diledikleri projeye destek
      vermek amacıyla belirlenmiş bağış paketlerinden bir veya birden fazlasını
      seçerek bağış yapabilirler. Bağış paket(leri) seçildikten, ödeme bilgileri
      girildikten ve ödeme onayı alındıktan sonra yapılan bağışın değiştirilmesi
      veya geri iade edilmesi kesinlikle mümkün değildir.
    </p>
  </Modal>
);

export default ReturnPolicyModal;
