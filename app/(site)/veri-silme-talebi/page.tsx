import type { Metadata } from "next";
import Link from "next/link";

// SEO Metadata
export const metadata: Metadata = {
  title: "Veri Silme Talebi | YATTA",
  description: "Yatta.com.tr'de oluşturduğunuz hesabınızı ve kişisel verilerinizi silme talebi nasıl yapılır? KVKK kapsamında veri silme hakkınız hakkında bilgiler.",
  alternates: { 
    canonical: "https://yatta.com.tr/veri-silme-talebi" 
  },
  openGraph: {
    title: "Veri Silme Talebi | YATTA",
    description: "Hesap ve kişisel veri silme talebinde bulunma süreci hakkında detaylı bilgiler.",
    url: "https://yatta.com.tr/veri-silme-talebi",
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
          Veri Silme Talebi
        </h1>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose text-muted-foreground">
          Yatta.com.tr olarak kullanıcılarımızın gizlilik haklarına saygı duyuyor 
          ve kişisel verilerin silinmesi hakkını tanıyoruz. KVKK (Kişisel Verilerin 
          Korunması Kanunu) kapsamında, dilediğiniz zaman hesabınızı ve kişisel 
          bilgilerinizi sistemimizden tamamen sildirme talebinde bulunabilirsiniz. 
          Bu sayfa, veri silme sürecinin nasıl işlediğini adım adım açıklamaktadır.
        </p>
      </header>

      {/* Silinebilir Veriler */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Hangi Veriler Silinebilir?</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Veri silme talebiniz doğrultusunda, sistemimizde kayıtlı bulunan aşağıdaki 
          kişisel bilgileriniz kalıcı olarak silinir. Bu işlem geri alınamaz bir 
          işlemdir ve tamamlandıktan sonra bu bilgilere tekrar erişim sağlanamaz.
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>Sosyal medya (Google, Facebook) ile oluşturulmuş kullanıcı hesabı</li>
          <li>E-posta adresi ve telefon numarası</li>
          <li>Ad ve soyad bilgileriniz</li>
          <li>Profil fotoğrafınız (varsa)</li>
          <li>Oturum kayıtları ve çerez verileri</li>
          <li>Geçmiş rezervasyon bilgileri (talep etmeniz halinde)</li>
        </ul>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose text-muted-foreground">
          <strong>Not:</strong> Yasal zorunluluklar (vergi kanunu, muhasebe mevzuatı vb.) 
          nedeniyle saklanması gereken fatura ve ödeme bilgileri silinmeyebilir. 
          Bu veriler sadece yasal saklama süreleri boyunca muhafaza edilir.
        </p>
      </section>

      {/* Talep Süreci */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Veri Silme Talebi Nasıl Yapılır?</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Hesabınızı ve verilerinizi silmek için aşağıdaki e-posta adresine bir 
          talep göndermeniz yeterlidir. Talebinizi işleme alabilmemiz için kayıtlı 
          e-posta adresinizden gönderim yapmanız veya kimlik doğrulama yapmanız 
          gerekebilir.
        </p>
      </section>

      {/* İletişim Bilgisi */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Talep İletişim Adresi</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Veri silme talebinizi aşağıdaki e-posta adresine iletebilirsiniz:
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-base md:text-lg font-medium">
            📧 E-posta: <a href="mailto:destek@yatta.com.tr" className="text-blue-600 hover:underline">destek@yatta.com.tr</a>
          </p>
        </div>
      </section>

      {/* E-posta Şablonu */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Örnek Talep Metni</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Veri silme talebinizi iletirken aşağıdaki örnek metni kullanabilirsiniz. 
          Bu şablon, talebinizin net bir şekilde anlaşılmasını ve hızlı işlem 
          görmesini sağlar.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold">Konu: Veri Silme Talebi</p>
          <div className="text-sm leading-relaxed text-slate-700 space-y-1 font-mono">
            <p>Merhaba,</p>
            <p className="mt-2">
              Yatta.com.tr platformunda oluşturduğum kullanıcı hesabımın ve 
              kişisel verilerimin tamamının sisteminizden silinmesini rica ediyorum.
            </p>
            <p className="mt-2">Adım: [Adınızı yazın]</p>
            <p>Kayıtlı e-posta adresim: [E-posta adresinizi yazın]</p>
            <p className="mt-2">Teşekkür ederim.</p>
          </div>
        </div>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose text-muted-foreground">
          Yukarıdaki şablonu kopyalayıp kendi bilgilerinizi doldurarak 
          destek@yatta.com.tr adresine gönderebilirsiniz.
        </p>
      </section>

      {/* İşlem Süresi */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Veriler Ne Kadar Sürede Silinir?</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Veri silme talebiniz tarafımıza ulaştıktan sonra, kimlik doğrulama 
          işlemleri tamamlanır ve yasal zorunluluklar çerçevesinde verileriniz 
          silinir. Süreç şu şekilde işler:
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>
            <strong>Kimlik doğrulama:</strong> Talebinizin güvenliği için kayıtlı 
            e-posta adresinizden gönderim yapmanız veya kimlik bilgilerinizi 
            teyit etmeniz istenebilir.
          </li>
          <li>
            <strong>İşlem süresi:</strong> Talepler en geç 7 iş günü içinde 
            sonuçlandırılır.
          </li>
          <li>
            <strong>Bilgilendirme:</strong> Silme işlemi tamamlandığında size 
            e-posta ile onay bildirimi gönderilir.
          </li>
        </ul>
      </section>

      {/* Önemli Uyarılar */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Dikkat Edilmesi Gereken Hususlar</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Veri silme işlemi geri alınamaz bir işlemdir. Bu nedenle talebinizi 
          göndermeden önce aşağıdaki hususları dikkatlice değerlendirmenizi 
          öneririz:
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>
            <strong>Geri alınamaz işlem:</strong> Verileriniz kalıcı olarak 
            silinir ve kurtarılamaz.
          </li>
          <li>
            <strong>Yeni hesap gereksinimi:</strong> Gelecekte tekrar hizmet 
            almak isterseniz, yeni bir hesap oluşturmanız gerekir.
          </li>
          <li>
            <strong>Geçmiş rezervasyonlar:</strong> Daha önceki rezervasyon 
            bilgileriniz de silinir.
          </li>
          <li>
            <strong>Yasal zorunluluklar:</strong> Vergi ve muhasebe mevzuatı 
            gereği saklanması zorunlu olan fatura ve ödeme bilgileri, yasal 
            saklama süreleri dolana kadar muhafaza edilir.
          </li>
        </ul>
      </section>

      {/* Alternatif Çözümler */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Hesabımı Silmeden Önce Ne Yapabilirim?</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Eğer hesabınızı tamamen silmek yerine gizliliğinizi korumak istiyorsanız, 
          alternatif olarak şunları yapabilirsiniz:
        </p>
        <ul className="list-disc list-inside text-sm md:text-base leading-relaxed md:leading-loose">
          <li>Profil bilgilerinizi güncelleyerek gereksiz bilgileri kaldırabilirsiniz</li>
          <li>E-posta bildirimlerini kapatabilirsiniz</li>
          <li>Hesabınızdan çıkış yaparak aktif kullanımı durdurabilirsiniz</li>
        </ul>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Ancak verilerinizin tamamen silinmesini istiyorsanız, yukarıda belirtilen 
          süreçleri takip edebilirsiniz.
        </p>
      </section>

      {/* KVKK Hakları */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Diğer KVKK Haklarınız</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Veri silme hakkının yanı sıra, KVKK kapsamında başka haklara da sahipsiniz. 
          Kişisel verilerinizin işlenmesi, güvenliği ve korunması hakkında daha 
          fazla bilgi için{" "}
          <Link 
            href="/gizlilik-politikasi" 
            className="text-blue-600 hover:underline font-medium"
          >
            Gizlilik Politikası
          </Link>{" "}
          sayfamızı ziyaret edebilirsiniz.
        </p>
      </section>

      {/* İletişim */}
      <section className="space-y-3 border-t pt-6">
        <h2 className="text-lg md:text-xl font-semibold">Destek ve İletişim</h2>
        <p className="text-sm md:text-base leading-relaxed md:leading-loose">
          Veri silme süreci veya kişisel verilerinizle ilgili her türlü soru 
          için bizimle iletişime geçebilirsiniz:
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

