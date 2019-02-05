import React from "react";

import { Modal } from "antd";

const TermsOfServiceModal = props => (
  <Modal
    title="Paydaplatformu.org Kullanıcı Sözleşmesi"
    visible={props.visible}
    onCancel={props.dismissModal}
    footer={null}
  >
    <h3>(İlan Tarihi: 29.09.2015)</h3>
    <h4>Madde 1 - Giriş</h4>
    <p>
      İşbu kullanıcı sözleşmesi ("sözleşme") ve www.paydaplatformu.org sitesinde
      (¨site¨) yer alan diğer kurallar, Paylaşma ve Dayanışma Platformu Derneği
      (“Payda”) tarafından sunulan hizmetlerin şart ve koşullarını
      düzenlemektedir. Sitede yer alan tüm politika ve kurallar işbu sözleşmenin
      ayrılmaz bir parçası olarak, işbu sözleşmenin ekini oluşturmaktadır.
    </p>
    <p>
      İşbu sözleşme, sizinle, Nispetiye Mahallesi Gazi Güçnar Sokak Uygur İş
      Merkezi No 4A, D:1 - Beşiktaş İSTANBUL adresinde yerleşik Paylaşma ve
      Dayanışma Platformu Derneği (“Payda”) arasında yapılmaktadır.
      Hizmetlerimizi kullanmakla, işbu sözleşmenin hüküm ve şartlarını kabul
      etmektesiniz.
    </p>
    <h4>Madde 2 - Süre</h4>
    <p>
      Sizin tarafınızdan gerekli kimlik bilgilerinin siteye girilmesi ve yine
      tarafınızca verilen e-posta adresine gönderilecek e-postanın teyit
      edilmesi ile üyelik kayıt işlemi tamamlanır. Üyelik sürecine girmeyen
      kullanıcılar için, işbu sözleşme www.paydaplatformu.org üzerinde herhangi
      bir bağış yapıldığı andan itibaren yürürlüğe girecektir. İşbu sözleşme tüm
      kullanıcılar için geçerlidir. İşbu sözleşme; yeni kullanıcılar için üyelik
      kayıt işleminin tamamlanması ile, mevcut kullanıcılar için onaylandığı
      tarihte, yürürlüğe girecektir.
    </p>
    <h4>Madde 3 - Kapsam</h4>
    <p>
      Payda, sizlere internet üzerinden Payda’nın dilediğiniz projesine destek
      vermek amacıyla bağış yapma imkanı sunmaktadır. www.paydaplatformu.org
      üzerinden herhangi bir ürün veya hizmet satışı gerçekleştirilmemektedir.
    </p>
    <h4>Madde 4 - Hizmetler</h4>
    <p>
      www.paydaplatformu.org üzerinden verilen hizmet Sanal Bağışyeri
      hizmetidir. Sanal Bağışyeri, kullanıcılara diledikleri projeye diledikleri
      bağış paketlerinden bir tanesini seçerek bağış yapabilecekleri bir
      platform sağlar.
    </p>
    <h4>Madde 5 - Kullanım Şekli</h4>
    <p>
      www.paydaplatformu.org üzerinden bağış yaparken şunlara dikkat edilmesi
      gerekmektedir:
    </p>
    <ul class="disc">
      <li>Doğru bağış paketinin seçilmesi 1 www. paydaplatformu. org</li>
      <li>
        Ödeme bilgilerinin (bağış yapan kişinin ismi, kredi kartı numarası vb
        bilgiler) doğru girilmesi
      </li>
      <li>İmkan varsa, doğru taksit sayısının girilmesi</li>
    </ul>
    <p />
    <p>
      Bu bilgiler girildikten sonra ve ödeme onaylandıktan sonra herhangi bir
      değişiklik yapılması mümkün değildir.
    </p>
    <p>
      Her yapılan bağış için Payda, Dernekler Kanunu gereği bir makbuz
      hazırlayacak ve kendisi için saklayacaktır. Kullanıcının bu makbuzun bir
      kopyasını istemesi durumunda info@paydaplatformu.org adresine e-posta
      göndererek bu talebini iletmesi gerekmektedir.
    </p>
    <h4>Madde 6 – İade Koşulları</h4>
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
    <h4>Madde 7 – Kullanım Şartları</h4>
    <p>
      Siteye girdiğinizde veya www.paydaplatformu.org sitesini kullanırken
      aşağıda belirtilen işlemlerin yapılması sözleşmeye açıkça aykırılık olarak
      kabul edilecektir:
    </p>
    <ul class="disc">
      <li>
        Payda’nın yazılı onayı olmaksızın, kullanıcı hesabının veya isminin
        devredilmesi,
      </li>
      <li>
        Spam, talep edilmemiş veya toplu elektronik iletişim yapılması veya
        zincirleme e- posta gönderilmesi,
      </li>
      <li>
        Payda’ya veya kullanıcılarına zarar verebilecek virüs veya
        teknolojilerin dağıtımı, yayılması,
      </li>
      <li>
        Kullanıcı profili değerlendirme sistemini bozmaya yönelik davranışlar
        dahil, www.paydaplatformu.org altyapısına, sistemine zarar verilmesi,
      </li>
      <li>
        Herhangi bir amaçla siteye robot veya otomatik giriş yöntemleri ile
        girilmesi,
      </li>
      <li>
        Kullanıcıların yazılı ön onayı olmaksızın, kullanıcıların e-posta veya
        diğer kişisel bilgilerinin toplanması, saklanması,
      </li>
      <li>
        Sitenin (tasarım, metin, imge, html kodu ve diğer kodlar da dahil ve
        fakat bunlarla sınırlı olmamak kaydıyla) herhangi bir fikri ve/veya
        sınai mülkiyet konusu parçasının 2 www. paydaplatformu. org yeniden
        satışı, paylaşımı, dağıtımı, çoğaltılması, bunlardan türemiş, işleme
        çalışmalar yapılması.
      </li>
    </ul>
    <p>
      Eğer siteye bir tüzel kişi olarak üye oluyorsanız, ilgili tüzel kişiyi
      temsil ve ilzama yetkili olduğunuzu beyan ve garanti edersiniz. Aksi
      halde, doğan borç ve yükümlülüklerden şahsen sorumlu olmayı kabul
      edersiniz.
    </p>
    <p>
      İşbu sözleşmeye taraf olmakla, Payda’nın site aracılığıyla kullanıcılar
      arasında gerçekleşen her türlü iletişimi ve bunların içeriğini
      izleyebileceğini, işleyebileceğini ve bu içeriğe ilişkin kayıtları yasal
      mevzuat gereği en az 3 yıl süreyle tutabileceğini, saklayabileceğini ve
      mevzuat kapsamında gerektiğinde ilgililere verebileceğini kabul
      etmektesiniz.
    </p>
    <h4>Madde 8 - Fikri Mülkiyet</h4>
    <p>
      Sitenin tasarımı, imge, html kodu dahil ve fakat bunlarla sınırlı olmamak
      kaydıyla sitede Payda tarafından oluşturulan tüm içerik ile Payda markası
      ve logosu Payda’ya aittir. Kullanıcılar, Payda’nın fikri mülkiyet
      haklarına tabi eserlerini kullanamaz, paylaşamaz, dağıtamaz, sergileyemez,
      çoğaltamaz, bunlardan türemiş çalışmalar yapamaz.
    </p>
    <h4>Madde 9 – Payda’nın Hakları</h4>
    <p>
      Kullanıcı olarak, Payda’ya yöneltilecek her hangi bir yasal takibat,
      soruşturma veya davada Payda’nın sorumlu olmadığını ve Payda’nın kendisini
      savunması için gerekli olan tüm bilgi ve belgeleri en kısa sürede
      sağlamayı kabul etmektesiniz. Üçüncü kişilerden uyarı gelmesi veya
      herhangi bir aykırılık tespit edilmesi halinde, Payda ilgili içerikleri
      siteden kaldırma hakkına sahiptir. Payda’nın söz konusu içerikleri siteden
      kaldırması nedeniyle kimseye karşı herhangi bir tazminat yükümlülüğü
      doğmayacaktır.
    </p>
    <h4>Madde 10 - Fesih</h4>
    <p>
      Taraflardan herhangi biri, tek taraflı olarak işbu sözleşmeyi
      feshedilebilir. Böyle bir fesih halinde taraflar fesih tarihine kadar
      doğmuş olan hak ve borçları karşılıklı olarak ifa edeceklerdir.
    </p>
    <p>
      Payda, işbu sözleşme ve eklerini ihlal etmeniz durumunda sözleşmeyi ve
      üyeliğinizi derhal tek taraflı olarak feshedebilecektir. Bu durumda,
      Payda’nın uğradığı/uğrayabileceği tüm zarar ve ziyandan sorumlu olduğunuzu
      kabul etmektesiniz.
    </p>
    <h4>Madde 11 - Sorumluluklar</h4>
    <p>
      Siz, i) işbu sözleşmeye aykırı eylem veya işlemler ii) kullanacağız marka,
      logo ve içerik iii) listelediğiniz ürün ve/veya hizmetler iv) yaptığınız
      reklam, promosyon, kampanya veya tanıtım ve v) yasal düzenlemelere aykırı
      eylem ve işlemler nedeniyle Payda, Payda 3 www. paydaplatformu. org
      çalışanları ve yöneticileri ile Payda kullanıcılarının maruz kalabileceği
      maddi/manevi, doğrudan/dolaylı zararları ve yapmış olduğu tüm masrafları
      (yargılama giderleri ve avukatlık masrafları vb.), harcamaları ve başta
      tazminat ve idari para cezası olmak üzere yapmış olduğu tüm ödemeleri,
      hiçbir yasal merciin hükmüne hacet kalmaksızın, Payda’nın ilk yazılı
      talebini müteakip 7 (yedi) gün içerisinde tüm fer'ileriyle birlikte nakden
      ve defaten ödemeyi gayri kabili rücu olarak kabul etmektesiniz.
    </p>
    <p>
      Payda’nın işbu sözleşmeden kaynaklanan sorumluluğu, kasıt ve ağır ihmal
      halleri hariç olmak üzere, işbu sözleşme tahtında, zarara yol açan olay
      tarihi itibariyle Payda’nın kullanıcıdan varsa tahsil etmiş olduğu bağış
      ve komisyonların toplamı ile sınırlıdır.
    </p>
    <h4>Madde 12 - Genel</h4>
    <p>
      Taraflardan herhangi biri, işbu sözleşme kapsamında üstlendiği herhangi
      bir yükümlülüğün, mücbir sebepler nedeniyle yerine getirilmemesi veya
      gecikmesinden dolayı diğer tarafa karşı sorumlu olmayacaktır. Mücbir
      sebep, tarafların makul kontrolleri dışında kalan öngörülmeyen ve
      önlenemeyen herhangi bir olaydır. Aşağıda belirtilenler ile sınırlı
      kalmamak kaydıyla, halk ayaklanması, savaş, hükümet tahditleri ve idari
      kararlar, ambargo, hükümetin veya bir kurumunun uygulaması, internet hızı
      ve kesintileri, doğal afet, fırtına, yangınlar, kaza, sabotaj, patlama,
      terörist saldırı, malzeme veya sarf malzemesi darlığı, grev ve lokavt
      mücbir sebep sayılır.
    </p>
    <p>
      Taraflar, işbu sözleşmeden doğan hak ve yükümlülüklerini herhangi bir
      üçüncü kişiye devredemeyeceklerdir.
    </p>
    <p>
      Tarafınızla yapılacak bütün bildirimler, elektronik ortamda ilanlar ile ya
      da yazılı olarak sistemde belirttiğiniz e-posta adresinize veya fiziksel
      adresinize yapılacaktır. Herhangi bir e- posta veya adres değişikliğini
      yazılı olarak bildirmediğiniz veya sitede güncellemediğiniz takdirde,
      mevcut e-posta adresinize veya fiziksel adresinize yapılacak tebligat
      geçerli kabul edilecektir.
    </p>
    <p>
      Kullanıcılar, siteye üye olurken Payda tarafından telefon, çağrı
      merkezleri, otomatik arama makineleri, e-posta, SMS vb. vasıtalarla
      yapılacak duyuru ve kampanyalar ile Payda hakkında yapılacak anketler ile
      ilgili iletişim çalışmalarından haberdar olup olmamaya ilişkin
      tercihlerini belirlerler.
    </p>
    <p>
      Kullanıcılar, kendilerine gönderilen elektronik iletilerde bulunan
      “listeden çıkar” seçeneği ile her zaman ve ücretsiz olarak kendilerine
      gönderilecek elektronik iletileri durdurabilirler. 4 www. paydaplatformu.
      org Kullanıcılar, işbu sözleşmeyi kabul etmekle, Payda’nın, kullanıcılara
      ilişkin bilgileri, kişisel veriler de dahil olmak üzere ve fakat bununla
      sınırlı kalmaksızın, Gizlilik Politikası'ndaki düzenlemelere uygun olarak
      kullanabileceğini ve 3.kişilere aktarabileceğini kabul ederler.
    </p>
    <p>
      Payda işbu sözleşmeyi, www.paydaplatformu.org adresinde yayınlamak
      suretiyle her zaman değiştirebilir.
    </p>
    <p>
      Sitemizde yer alan politikalar ve kurallar dönem dönem
      değiştirilebilirler. Değişiklikler www.paydaplatformu.org sitesinde
      yayınlandıkları tarihte geçerli olurlar.
    </p>
    <p>
      İşbu sözleşmenin uygulanmasından ve yorumlanmasından doğan hukuki
      itilafların hallinde Türk Hukuku uygulanacaktır.
    </p>
    <p>
      Taraflar arasında, işbu sözleşme hükümlerinin yorumu ya da uygulanmasından
      dolayı çıkabilecek tüm ihtilafların hallinde, İstanbul Çağlayan
      Mahkemeleri ile İcra Müdürlükleri yetkili olacaktır. Taraflar, işbu
      sözleşmeden doğabilecek ihtilaflarda taraflara ait defter ve kayıtlarının,
      bilgisayar kayıtlarının, teyitli faks mesajlarının, e-maillerinin muteber,
      bağlayıcı, delil teşkil edeceğini kabul ederler.
    </p>
    <p>
      Bir mahkeme veya başka yetkili bir makam tarafından işbu sözleşmenin
      herhangi bir hükmünün tamamen veya kısmen geçersiz veya yürütülemez
      olduğuna karar verilirse, bu sözleşmenin diğer hükümlerinin ve söz konusu
      hükmün geri kalanının geçerliliği etkilenmeyecektir.
    </p>
    <p>
      Payda’nın haklarından herhangi birisini kullanmaması veya geç kullanması,
      bu haktan feragat ettiği anlamına gelmeyecektir.
    </p>
    <p>
      Bu sözleşmedeki hiçbir unsur taraflar arasında herhangi bir temsilcilik,
      acente, ortaklık veya başka türlü bir ortak girişim (joint venture vs.)
      ilişkisi olarak yorumlanmayacaktır.
    </p>
  </Modal>
);

export default TermsOfServiceModal;
