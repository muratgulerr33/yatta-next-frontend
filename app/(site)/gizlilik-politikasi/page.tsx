import type { Metadata } from "next";
import Link from "next/link";

// SEO Metadata
export const metadata: Metadata = {
  title: "Gizlilik Politikası ve KVKK | YATTA",
  description: "Yatta.com.tr'de kişisel verilerinizin korunması, işlenmesi ve saklanması hakkında gizlilik politikası ve KVKK uyumlu bilgilendirme metni.",
  alternates: { 
    canonical: "https://yatta.com.tr/gizlilik-politikasi" 
  },
  openGraph: {
    title: "Gizlilik Politikası ve KVKK | YATTA",
    description: "Kişisel verilerinizin güvenliği ve gizliliği hakkında detaylı bilgiler.",
    url: "https://yatta.com.tr/gizlilik-politikasi",
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
          Gizlilik Politikası ve KVKK
        </h1>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose text-muted-foreground">
          Yatta.com.tr olarak kullanıcılarımızın kişisel verilerinin gizliliğine 
          ve güvenliğine en üst düzeyde önem veriyoruz. Bu sayfa, web sitemizi 
          ziyaret ettiğinizde veya sosyal medya hesaplarınızla oturum açtığınızda 
          hangi bilgilerin toplandığını, nasıl kullanıldığını ve hangi koşullarda 
          saklandığını 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) 
          çerçevesinde açıklamaktadır.
        </p>
      </header>

      {/* Toplanan Bilgiler */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Hangi Kişisel Veriler Toplanır?</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Platformumuzda hesap oluşturduğunuzda, rezervasyon yaptığınızda veya 
          sosyal medya hesaplarınız ile giriş yaptığınızda bazı kişisel bilgileriniz 
          sistem tarafından kaydedilir. Bu bilgiler yalnızca hizmet kalitesini 
          artırmak ve müşteri deneyimini iyileştirmek amacıyla kullanılır.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>Ad ve soyad bilginiz</li>
          <li>E-posta adresiniz</li>
          <li>Telefon numaranız (opsiyonel)</li>
          <li>Profil fotoğrafınız (sosyal giriş yapıldığında)</li>
          <li>IP adresi ve tarayıcı bilgisi</li>
          <li>Rezervasyon ve işlem geçmişi</li>
        </ul>
      </section>

      {/* Sosyal Medya Girişi */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Sosyal Medya ile Giriş Yapma</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Kullanıcılarımız Google, Facebook gibi sosyal medya platformları aracılığıyla 
          hızlı ve güvenli bir şekilde sitemize giriş yapabilirler. Bu hizmetler 
          üzerinden tarafımıza aktarılan bilgiler oldukça sınırlıdır ve yalnızca 
          oturum açma işlemi için kullanılır. Sosyal medya sağlayıcılarınızın 
          gizlilik politikaları kendi platformlarında geçerlidir.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>Google veya Facebook'tan alınan ad-soyad</li>
          <li>Kayıtlı e-posta adresi</li>
          <li>Profil fotoğrafı (varsa ve izin verilmişse)</li>
        </ul>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Bu bilgiler asla üçüncü taraflarla paylaşılmaz ve sadece kullanıcı 
          hesabı oluşturmak amacıyla işlenir.
        </p>
      </section>

      {/* Verilerin Kullanım Amacı */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Kişisel Verilerin Kullanım Amaçları</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Toplanan kişisel veriler, yasal zorunluluklar ve hizmet kalitesinin 
          artırılması dışında başka hiçbir amaçla kullanılmaz. Verileriniz 
          kesinlikle satılmaz, kiralanmaz veya reklam amaçlı üçüncü taraflara 
          aktarılmaz.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>Kullanıcı hesabı oluşturma ve yönetimi</li>
          <li>Rezervasyon işlemlerinin gerçekleştirilmesi</li>
          <li>Müşteri destek hizmetlerinin sağlanması</li>
          <li>İletişim ve bilgilendirme (kampanya, duyuru vb.)</li>
          <li>Güvenlik ve yasal yükümlülüklerin yerine getirilmesi</li>
        </ul>
      </section>

      {/* Veri Paylaşımı */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Verilerin Üçüncü Taraflarla Paylaşımı</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Yatta.com.tr, kullanıcı verilerini koruma konusunda son derece hassastır. 
          Kişisel bilgileriniz, yasal zorunluluklar (mahkeme kararı, resmi talep vb.) 
          dışında hiçbir koşulda üçüncü taraflarla paylaşılmaz, satılmaz veya 
          pazarlama amacıyla kullanılmaz.
        </p>
      </section>

      {/* Çerezler (Cookies) */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Çerez (Cookie) Kullanımı</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Web sitemiz, kullanıcı deneyimini geliştirmek ve site performansını 
          analiz etmek amacıyla çerez (cookie) teknolojisi kullanmaktadır. 
          Çerezler, tarayıcınıza kaydedilen küçük metin dosyalarıdır ve kişisel 
          kimlik bilgilerinizi içermez. Tarayıcı ayarlarınızdan çerezleri 
          devre dışı bırakabilirsiniz, ancak bu durumda bazı özellikler düzgün 
          çalışmayabilir.
        </p>
      </section>

      {/* Veri Güvenliği */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Veri Güvenliği ve Koruma</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Kişisel verileriniz, endüstri standardı güvenlik önlemleriyle korunmaktadır. 
          Sunucularımız güvenli veri merkezlerinde barındırılır, SSL/TLS şifrelemesi 
          ile veriler güvenli bir şekilde iletilir. Ödeme bilgileriniz hiçbir 
          zaman sistemimizde saklanmaz, güvenli ödeme altyapıları üzerinden işlenir.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>SSL sertifikası ile şifrelenmiş bağlantı</li>
          <li>Güvenli sunucu altyapısı</li>
          <li>Düzenli güvenlik güncellemeleri</li>
          <li>Erişim kontrolü ve yetkilendirme sistemi</li>
        </ul>
      </section>

      {/* Veri Saklama Süresi */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Verilerin Saklanma Süresi</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Kişisel verileriniz, yasal zorunluluklar ve işlem gereklilikleri 
          doğrultusunda belirli bir süre saklanır. Hesap silme talebiniz sonrasında, 
          yasal saklama yükümlülükleri dışındaki verileriniz tamamen silinir.
        </p>
      </section>

      {/* Veri Silme Hakkı */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Kişisel Verilerin Silinmesi Hakkı</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          KVKK kapsamında, kullanıcılarımız istedikleri zaman hesaplarını ve 
          kişisel verilerini sistemimizden kalıcı olarak sildirme hakkına sahiptir. 
          Veri silme talebinizi iletmek için{" "}
          <Link 
            href="/veri-silme-talebi" 
            className="text-blue-600 hover:underline font-medium"
          >
            Veri Silme Talebi
          </Link>{" "}
          sayfasını ziyaret edebilir veya doğrudan destek ekibimizle iletişime geçebilirsiniz.
        </p>
      </section>

      {/* KVKK Hakları */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">KVKK Kapsamında Haklarınız</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca aşağıdaki 
          haklara sahipsiniz:
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenen verileriniz hakkında bilgi talep etme</li>
          <li>Verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Verilerin eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme</li>
          <li>Verilerin silinmesini veya yok edilmesini talep etme</li>
        </ul>
      </section>

      {/* Politika Değişiklikleri */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Gizlilik Politikası Güncellemeleri</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Bu gizlilik politikası, yasal düzenlemeler ve hizmet geliştirmeleri 
          doğrultusunda zaman zaman güncellenebilir. Önemli değişiklikler olduğunda 
          kullanıcılarımız e-posta veya site bildirimi ile bilgilendirilir.
        </p>
      </section>

      {/* İletişim */}
      <section className="space-y-3 border-t pt-6">
        <h2 className="text-lg md:text-xl font-semibold">Gizlilik Konusunda İletişim</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Gizlilik politikamız, kişisel verilerinizin korunması veya KVKK hakları 
          konusunda sorularınız için bizimle iletişime geçebilirsiniz:
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>📧 E-posta: destek@yatta.com.tr</li>
          <li>📞 Telefon: +90 530 487 23 33</li>
          <li>🌐 Web: https://yatta.com.tr</li>
        </ul>
      </section>
    </section>
  );
}

