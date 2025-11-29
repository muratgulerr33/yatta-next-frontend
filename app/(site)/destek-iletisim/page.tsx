'use client';

import { useHelinChatContext } from '@/contexts/HelinChatContext';

export default function DestekIletisimPage() {
  const { toggleChat } = useHelinChatContext();

  // E-posta spam koruması için obfuscated email
  // E-posta adresi sayfada görünür ama spam botları tarafından kolay tespit edilemez
  const getEmail = () => {
    // Base64 veya basit obfuscation yerine parçalara ayırarak gösteriyoruz
    const user = 'destek';
    const domain = 'yatta.com.tr';
    return `${user}@${domain}`;
  };

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const email = getEmail();
    window.location.href = `mailto:${email}`;
  };

  return (
    <section className="w-full max-w-2xl mx-auto space-y-10">
      {/* Sayfa başlığı */}
      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          Destek & İletişim
        </h1>
        <p className="text-muted-foreground">
          Size yardımcı olmak için buradayız. Sorularınız, önerileriniz veya
          destek talepleriniz için bizimle iletişime geçebilirsiniz. En kısa
          sürede size dönüş yapacağız.
        </p>
      </header>

      {/* İletişim Bilgileri */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">İletişim Bilgileri</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">Telefon</p>
            <a
              href="tel:+905304872333"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#004aad] text-white rounded-lg font-semibold hover:bg-[#003380] transition-colors"
            >
              Ara: +90 530 487 23 33
            </a>
          </div>
          <div>
            <p className="font-medium mb-2">WhatsApp</p>
            <a
              href="https://wa.me/905304872333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#1DA851] transition-colors"
            >
              WhatsApp ile İletişime Geç
            </a>
          </div>
          <div>
            <p className="font-medium mb-2">E-posta</p>
            <a
              href="#"
              onClick={handleEmailClick}
              className="text-[#004aad] hover:underline"
            >
              {getEmail()}
            </a>
          </div>
          <div>
            <p className="font-medium mb-2">Adres</p>
            <p>Eğriçam Marina, Mersin</p>
            <a
              href="https://maps.app.goo.gl/CxGMcXUyCxLbnmut9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#004aad] hover:underline mt-1 inline-block"
            >
              Haritada Görüntüle →
            </a>
          </div>
        </div>
      </section>

      {/* Çalışma Saatleri */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Çalışma Saatleri</h2>
        <div className="space-y-2">
          <p>
            <strong>Hafta İçi:</strong> 09:00 - 23:30
          </p>
          <p>
            <strong>Pazar:</strong> 12:00 - 21:00
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Çalışma saatleri dışında da WhatsApp üzerinden bize ulaşabilirsiniz.
          Mesajlarınızı en kısa sürede yanıtlayacağız.
        </p>
      </section>

      {/* Asistanımıza Bağlanın */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Dijital Asistanımız</h2>
        <p>
          Hızlı yanıt almak için dijital asistanımız Helin ile konuşabilirsiniz.
          Rezervasyon, fiyatlandırma ve genel sorularınız için 7/24 hizmetinizdeyiz.
        </p>
        <button
          onClick={toggleChat}
          className="inline-flex items-center justify-center px-6 py-3 bg-[#004aad] text-white rounded-lg font-semibold hover:bg-[#003380] transition-colors shadow-lg hover:shadow-xl"
        >
          Asistanımıza Bağlanın
        </button>
      </section>

      {/* Sosyal Medya */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Sosyal Medya</h2>
        <p>
          Bizi sosyal medya hesaplarımızdan takip edebilir, güncel haberler ve
          kampanyalardan haberdar olabilirsiniz.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://facebook.com/yattacomtr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#004aad] hover:underline"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com/yattacomtr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#004aad] hover:underline"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com/@yattacomtr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#004aad] hover:underline"
          >
            TikTok
          </a>
          <a
            href="https://youtube.com/@yattacomtr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#004aad] hover:underline"
          >
            YouTube
          </a>
        </div>
      </section>
    </section>
  );
}

