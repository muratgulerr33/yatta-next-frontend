import type { Metadata } from "next";

// SEO Metadata
export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi | YATTA",
  description: "Yatta.com.tr üzerinden yapılan online rezervasyonlara ilişkin mesafeli satış sözleşmesi. Tarafların hak ve yükümlülükleri, hizmet koşulları ve yasal düzenlemeler.",
  alternates: { 
    canonical: "https://yatta.com.tr/mesafeli-satis-sozlesmesi" 
  },
  openGraph: {
    title: "Mesafeli Satış Sözleşmesi | YATTA",
    description: "Online rezervasyon hizmetlerimize ilişkin mesafeli satış sözleşmesi ve kullanım koşulları.",
    url: "https://yatta.com.tr/mesafeli-satis-sozlesmesi",
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
          Mesafeli Satış Sözleşmesi
        </h1>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose text-muted-foreground">
          İşbu sözleşme, Yatta.com.tr web sitesi aracılığıyla gerçekleştirilen 
          tüm hizmet rezervasyonlarına dair tarafların sorumluluklarını, haklarını 
          ve yükümlülüklerini düzenlemektedir. 6502 sayılı Tüketicinin Korunması 
          Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında 
          hazırlanmıştır.
        </p>
      </header>

      {/* Satıcı Bilgileri */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Hizmet Sağlayıcı Bilgileri</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Hizmet sağlayıcı olarak Yatta.com.tr platformunu işleten şirket bilgileri 
          aşağıda detaylı olarak sunulmaktadır. Rezervasyon ve işlem süreçlerinde 
          yasal muhatap aşağıdaki bilgilerde belirtilen firmadır.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>
            <strong>Ticari Unvan:</strong> yatta.com.tr – Murat Güler
          </li>
          <li>
            <strong>Adres:</strong> Eğriçam Mahallesi, Adnan Menderes Bulvarı No: 33-GA, 
            Mersin Marina AVM "E" İskelesi Yenişehir/Mersin
          </li>
          <li>
            <strong>İletişim Telefonu:</strong> +90 530 487 23 33
          </li>
          <li>
            <strong>E-posta Adresi:</strong> destek@yatta.com.tr
          </li>
          <li>
            <strong>Vergi Dairesi ve Numarası:</strong> İstiklal Vergi Dairesi / 14423076108
          </li>
        </ul>
      </section>

      {/* Alıcı Tanımı */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Müşteri (Alıcı) Tanımı</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Alıcı, Yatta.com.tr üzerinden online olarak rezervasyon gerçekleştiren 
          gerçek veya tüzel kişiyi ifade eder. Rezervasyon formunda beyan edilen 
          kimlik, iletişim ve ödeme bilgileri müşteri tarafından onaylanmış kabul 
          edilir ve bu bilgiler sözleşme süresince esas alınır.
        </p>
      </section>

      {/* Sözleşme Konusu */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Sözleşmenin Amacı ve Kapsamı</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Bu sözleşme, müşterinin web sitemiz üzerinden seçtiği ve ödeme yaptığı 
          hizmetlerin koşullarını belirler. Platform üzerinden sunulan farklı 
          kategorilerdeki hizmetler için geçerli olmak üzere, tarafların karşılıklı 
          hak ve yükümlülükleri aşağıdaki başlıklar altında düzenlenmiştir.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>Yat ve tekne kiralama hizmetleri</li>
          <li>Özel organizasyon ve etkinlik hizmetleri</li>
          <li>Konaklama hizmetleri (bungalov, villa vb.)</li>
          <li>Tur ve gezi paketleri</li>
        </ul>
      </section>

      {/* Hizmet Tanımı */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Hizmet Detayları ve Ücretlendirme</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Müşteri, rezervasyon sürecinde hizmetin türünü, süresini, başlangıç tarih 
          ve saatini, toplam ücret bilgisini ve varsa ek hizmet seçeneklerini ekranda 
          görerek onaylar. Ödeme işleminden önce tüm finansal detaylar açıkça 
          belirtilir. Fiyatlara KDV ve diğer yasal yükümlülükler dahildir.
        </p>
      </section>

      {/* Teslimat ve Katılım */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Hizmetin Yerine Getirilmesi</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Satın alınan hizmet, belirlenen tarih ve saatte müşterinin fiziksel katılımı 
          ile gerçekleştirilir. Herhangi bir fiziksel ürün veya dijital materyal kargo 
          yoluyla gönderilmez. Hizmetin sunulacağı konum, rezervasyon onayında 
          müşteriye iletilir.
        </p>
      </section>

      {/* Ödeme Koşulları */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Ödeme Şartları</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Ödemeler kredi kartı, banka havalesi/EFT veya entegre ödeme sistemleri 
          aracılığıyla tahsil edilir. Bazı rezervasyonlarda kısmi ön ödeme alınarak 
          kalan tutar hizmet günü tahsil edilebilir. Tüm ödeme detayları rezervasyon 
          aşamasında netleştirilir.
        </p>
      </section>

      {/* Cayma, İptal, İade */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">İptal, İade ve Cayma Hakkı</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          6502 sayılı kanunun 15. maddesi gereği, belirli bir tarihte veya dönemde 
          yapılması gereken konaklama, eğlence, dinlenme ve taşıma hizmetlerinde 
          cayma hakkı bulunmamaktadır. Ancak müşteri memnuniyeti önceliğimiz olduğundan, 
          iptal ve iade koşullarımız{" "}
          <a 
            href="/iptal-iade-kosullari" 
            className="text-blue-600 hover:underline"
          >
            İptal ve İade Koşulları
          </a>{" "}
          sayfasında detaylı olarak açıklanmıştır.
        </p>
      </section>

      {/* Yetkili Mahkeme */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Uyuşmazlık Çözümü</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          İşbu sözleşmeden doğabilecek her türlü uyuşmazlıkta Türkiye Cumhuriyeti 
          yasaları uygulanır. Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir. 
          Müşteri, tüketici hakları konusunda ilgili kamu kurumlarına başvuru hakkına sahiptir.
        </p>
      </section>

      {/* Yürürlük */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Sözleşmenin Onayı ve Yürürlüğü</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Müşteri, site üzerinden rezervasyon tamamlayarak bu sözleşmenin tüm 
          maddelerini okuduğunu, anladığını ve kabul ettiğini elektronik ortamda 
          onaylamış sayılır. Sözleşme, ödeme işleminin başarıyla tamamlanmasıyla 
          yürürlüğe girer.
        </p>
      </section>

      {/* İletişim */}
      <section className="space-y-3 border-t pt-6">
        <h2 className="text-lg md:text-xl font-semibold">İletişim Bilgileri</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Sözleşme ile ilgili sorularınız, şikayet ve önerileriniz için bizimle 
          iletişime geçebilirsiniz:
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>📞 Telefon: +90 530 487 23 33</li>
          <li>📧 E-posta: destek@yatta.com.tr</li>
          <li>🌐 Web: https://yatta.com.tr</li>
        </ul>
      </section>
    </section>
  );
}

