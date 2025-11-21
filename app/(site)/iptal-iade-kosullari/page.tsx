import type { Metadata } from "next";

// SEO Metadata
export const metadata: Metadata = {
  title: "İptal ve İade Koşulları | YATTA",
  description: "Yatta.com.tr'de yaptığınız rezervasyonların iptal, erteleme ve iade koşulları. Cayma hakkı ve müşteri memnuniyeti politikalarımız.",
  alternates: { 
    canonical: "https://yatta.com.tr/iptal-iade-kosullari" 
  },
  openGraph: {
    title: "İptal ve İade Koşulları | YATTA",
    description: "Rezervasyon iptali, erteleme ve iade süreçleri hakkında detaylı bilgiler.",
    url: "https://yatta.com.tr/iptal-iade-kosullari",
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
          İptal ve İade Koşulları
        </h1>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose text-muted-foreground">
          Yatta.com.tr üzerinden yaptığınız rezervasyonları iptal etmek, ertelemek 
          veya iade talep etmek istediğinizde uygulanacak koşulları bu sayfada 
          bulabilirsiniz. Müşteri memnuniyeti odaklı politikamız ile size en iyi 
          çözümleri sunmaya çalışıyoruz.
        </p>
      </header>

      {/* Genel Bilgilendirme */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Genel İptal ve İade Bilgileri</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Rezervasyon yaptıktan sonra planlarınızda değişiklik olması durumunda, 
          belirli koşullar dahilinde iptal, erteleme veya iade talebinde bulunabilirsiniz. 
          İptal ve iade işlemleri, hizmet tarihine kalan süreye göre değişiklik 
          göstermektedir. Süreçlerimiz şeffaf ve adil bir şekilde düzenlenmiştir.
        </p>
      </section>

      {/* İptal Koşulları */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Rezervasyon İptali Nasıl Yapılır?</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Rezervasyonunuzu iptal etmek istediğinizde, hizmet tarihine kalan süreye 
          bağlı olarak farklı iade oranları uygulanır. Erken iptal taleplerinde 
          daha yüksek iade oranı sağlanarak müşteri mağduriyeti en aza indirilir.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>
            <strong>72 saat ve üzeri iptal:</strong> Hizmet tarihinden en az 72 saat 
            (3 gün) öncesinde yapılan iptal taleplerinde, ödenen tutarın %70'i 
            iade edilir. Kalan %30 işlem ve organizasyon giderleri için mahsup edilir.
          </li>
          <li>
            <strong>72 saatten az süre kalan iptal:</strong> Hizmet tarihine 72 
            saatten daha az süre kaldığında yapılan iptal taleplerinde ücret 
            iadesi yapılmaz. Bu sürede organizasyon hazırlıkları tamamlanmış olur.
          </li>
          <li>
            <strong>Hizmet gününe gelinmemesi:</strong> Rezervasyon tarihinde 
            katılım sağlanmaması durumunda rezervasyon geçersiz sayılır ve 
            ödeme iadesi yapılmaz.
          </li>
        </ul>
      </section>

      {/* İade Süreci */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">İade Süreci ve İşlem Süresi</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          İptal talebiniz onaylandıktan sonra, iade işlemi ödeme yönteminize göre 
          gerçekleştirilir. Kredi kartına yapılan iadeler, bankanızın işlem 
          süresine bağlı olarak 2-10 iş günü içinde hesabınıza yansır. Havale/EFT 
          ile ödeme yaptıysanız, belirttiğiniz hesap bilgilerine 5 iş günü içinde 
          iade yapılır.
        </p>
      </section>

      {/* Erteleme Koşulları */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Rezervasyon Erteleme Politikası</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          İptal yerine rezervasyonunuzu farklı bir tarihe ertelemek isterseniz, 
          bu talep hizmet tarihinden en az 48 saat önce iletilmelidir. Erteleme 
          talebi alındığında, müsaitlik durumuna göre size uygun alternatif tarihler 
          önerilir.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>
            <strong>Erteleme hakkı:</strong> Her rezervasyon için sadece bir (1) 
            kez erteleme hakkı tanınır.
          </li>
          <li>
            <strong>Süre koşulu:</strong> Erteleme talebi en az 48 saat önceden 
            bildirilmelidir.
          </li>
          <li>
            <strong>Yeni tarih seçimi:</strong> Müsaitlik durumuna göre size 
            uygun tarih önerilir ve mutabakata varılır.
          </li>
          <li>
            <strong>Ücret farkı:</strong> Yeni tarihte fiyat değişikliği varsa, 
            fark tutarı tahsil edilir veya iade edilir.
          </li>
        </ul>
      </section>

      {/* Satıcı Kaynaklı İptal */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Hizmet Sağlayıcı Kaynaklı İptaller</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Kötü hava koşulları, teknik arıza, mücbir sebep veya öngörülemeyen 
          durumlar nedeniyle hizmetin verilemeyeceği anlaşıldığında, rezervasyon 
          firmamız tarafından iptal edilebilir. Bu durumda müşteriye önceden 
          bilgilendirme yapılır ve aşağıdaki seçenekler sunulur:
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>
            <strong>Tam iade:</strong> Ödenen tutarın tamamı herhangi bir kesinti 
            yapılmaksızın iade edilir.
          </li>
          <li>
            <strong>Alternatif tarih:</strong> Müşteriye uygun başka bir tarih 
            önerilir ve rezervasyon yeni tarihe taşınır.
          </li>
        </ul>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Firmamız kaynaklı iptallerde müşteri mağduriyeti oluşmaz ve tam hak 
          iadesi yapılır.
        </p>
      </section>

      {/* Cayma Hakkı */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Tüketici Cayma Hakkı Hakkında</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 15. Maddesi gereği, 
          belirli bir tarih veya dönemde yapılması gereken konaklama, taşıma, 
          araç kiralama, yiyecek-içecek tedariki, eğlence veya dinlenme amaçlı 
          hizmetlerde 14 günlük cayma hakkı uygulanmaz. Ancak Yatta.com.tr olarak 
          müşteri memnuniyetini ön planda tutarak yukarıdaki iptal ve erteleme 
          politikalarımızı uygulamaktayız.
        </p>
      </section>

      {/* İptal Talebi Nasıl Yapılır */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">İptal veya Erteleme Talebi Nasıl Yapılır?</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Rezervasyonunuzu iptal etmek veya ertelemek için aşağıdaki iletişim 
          kanallarından bizimle iletişime geçebilirsiniz. Talebinizi iletirken 
          rezervasyon numaranızı, ad-soyad bilgilerinizi ve rezervasyon tarihini 
          belirtmeniz işlemi hızlandıracaktır.
        </p>
      </section>

      {/* İletişim */}
      <section className="space-y-3 border-t pt-6">
        <h2 className="text-lg md:text-xl font-semibold">İptal ve İade Talebi İletişim</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          İptal, erteleme veya iade işlemleri için müşteri hizmetleri ekibimize ulaşın:
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

