import type { Metadata } from "next";

// SEO Metadata
export const metadata: Metadata = {
  title: "Ödeme ve Rezervasyon Koşulları | YATTA",
  description: "Yatta.com.tr'de online rezervasyon süreci, ödeme yöntemleri, fiyatlandırma ve fatura düzenleme koşulları hakkında detaylı bilgiler.",
  alternates: { 
    canonical: "https://yatta.com.tr/odeme-ve-rezervasyon" 
  },
  openGraph: {
    title: "Ödeme ve Rezervasyon Koşulları | YATTA",
    description: "Rezervasyon işlemleri, ödeme seçenekleri ve faturalama koşullarımız hakkında bilgi edinin.",
    url: "https://yatta.com.tr/odeme-ve-rezervasyon",
    siteName: "YATTA",
    type: "website",
  },
};

export default function Page() {
  return (
    <section className="w-full max-w-2xl mx-auto space-y-10">
      {/* Sayfa başlığı */}
      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          Ödeme ve Rezervasyon Koşulları
        </h1>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose text-muted-foreground">
          Yatta.com.tr platformunda gerçekleştireceğiniz rezervasyon işlemlerinin 
          nasıl yapıldığı, hangi ödeme yöntemlerinin kullanılabileceği ve 
          fiyatlandırma detaylarıyla ilgili tüm bilgileri bu sayfada bulabilirsiniz. 
          Güvenli ve hızlı rezervasyon için aşağıdaki koşulları incelemenizi öneririz.
        </p>
      </header>

      {/* Rezervasyon Süreci */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Online Rezervasyon Süreci</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Platformumuz üzerinden yapılan tüm rezervasyonlar internet ortamında 
          gerçekleştirilir ve ödeme işlemi tamamlanmadan kesinleşmez. Rezervasyon 
          yaparken müşteri tarafından seçilen tarih, saat ve hizmet türü bilgileri 
          sistemimizde otomatik olarak kaydedilir ve işlem geçmişinizde görüntülenebilir.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>Web sitesinden dilediğiniz hizmeti seçin</li>
          <li>Tarih, saat ve kişi sayısı gibi detayları belirleyin</li>
          <li>Sepete ekleyip ödeme adımına geçin</li>
          <li>Ödeme tamamlandığında e-posta veya WhatsApp ile onay alın</li>
        </ul>
      </section>

      {/* Rezervasyon Onayı */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Rezervasyon Onay Bildirimi</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Ödeme işleminiz başarıyla gerçekleştikten sonra, rezervasyon detaylarınız 
          kayıtlı e-posta adresinize ve isteğe bağlı olarak WhatsApp hattınıza 
          iletilir. Onay mesajında hizmet tarihi, saati, lokasyon bilgisi ve 
          rezervasyon numarası yer alır. Bu bilgileri hizmet günü yanınızda 
          bulundurmanızı tavsiye ederiz.
        </p>
      </section>

      {/* Ödeme Yöntemleri */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Kabul Edilen Ödeme Yöntemleri</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Müşterilerimize farklı ödeme seçenekleri sunarak işlem kolaylığı 
          sağlıyoruz. Güvenli ödeme altyapımız sayesinde kredi kartı bilgileriniz 
          şifrelenerek korunur. Banka havalesi veya EFT ile ödeme yapacaksanız, 
          açıklama kısmına mutlaka adınızı ve rezervasyon tarihini yazmanız gerekmektedir.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>Kredi kartı ve banka kartı (Visa, Mastercard, Troy)</li>
          <li>Banka havalesi (EFT) ile ödeme</li>
          <li>Online ödeme sistemleri (Iyzico, PayTR vb.)</li>
          <li>Havale yapıldığında dekont e-posta veya WhatsApp'tan gönderilmelidir</li>
        </ul>
      </section>

      {/* Havale/EFT Detayları */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Havale ve EFT ile Ödeme</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Havale veya EFT ile ödeme yapmayı tercih ederseniz, ödeme açıklamasına 
          mutlaka ad-soyad ve rezervasyon tarih bilgilerinizi eklemelisiniz. 
          Ödemenizi yaptıktan sonra dekont görselini destek@yatta.com.tr e-posta 
          adresine veya WhatsApp destek hattımıza iletmeniz gerekmektedir. 
          Havale onayı alındıktan sonra rezervasyonunuz kesinleşir.
        </p>
      </section>

      {/* Ön Ödeme ve Kalan Tutar */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Ön Ödeme ve Kalan Tutar Politikası</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Bazı hizmetlerimizde rezervasyonun garanti altına alınması için belirli 
          oranda ön ödeme talep edilmektedir. Ön ödeme oranı genellikle toplam 
          tutarın %30 ila %50 arasında değişir. Kalan ödeme, hizmetin verildiği 
          gün nakit olarak veya POS cihazı üzerinden kredi kartı ile tahsil edilir.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>Ön ödeme oranı rezervasyon sırasında belirtilir</li>
          <li>Kalan tutar hizmet günü ödenir</li>
          <li>Nakit veya kredi kartı ile ödeme yapılabilir</li>
        </ul>
      </section>

      {/* Fiyatlandırma */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Fiyatlandırma ve Vergilendirme</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Web sitemizde görüntülenen tüm fiyatlara KDV (Katma Değer Vergisi) dahildir. 
          Ayrıca belirtilmedikçe ek vergi veya hizmet bedeli talep edilmez. 
          Kampanyalı fiyatlar belirtilen süre ve koşullar dahilinde geçerlidir. 
          Kampanya süresi dolan hizmetler normal fiyatlarından sunulur.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>Tüm fiyatlar KDV dahildir</li>
          <li>İndirimli fiyatlar kampanya süresiyle sınırlıdır</li>
          <li>Fiyat değişiklikleri önceden duyurulur</li>
        </ul>
      </section>

      {/* Fatura Düzenleme */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Fatura Düzenlenmesi</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Kurumsal fatura talebi olan müşterilerimiz, rezervasyon işlemi sırasında 
          fatura bilgilerini (firma ünvanı, vergi dairesi, vergi numarası ve adres) 
          eksiksiz olarak girmelidir. Bireysel müşteriler için standart fatura 
          düzenlenir. Faturalar hizmet tamamlandıktan sonra dijital ortamda 
          e-posta adresinize iletilir.
        </p>
      </section>

      {/* İletişim */}
      <section className="space-y-3 border-t pt-6">
        <h2 className="text-lg md:text-xl font-semibold">Ödeme ve Rezervasyon Desteği</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Ödeme veya rezervasyon sürecinde herhangi bir sorun yaşarsanız, 
          müşteri hizmetleri ekibimiz size yardımcı olmaktan memnuniyet duyacaktır:
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>📞 Telefon: +90 530 487 23 33</li>
          <li>📧 E-posta: destek@yatta.com.tr</li>
          <li>💬 WhatsApp Destek Hattı</li>
          <li>🌐 Web: https://yatta.com.tr</li>
        </ul>
      </section>
    </section>
  );
}

