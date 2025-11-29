export default function BizKimizPage() {
  return (
    <section className="w-full max-w-2xl mx-auto space-y-10">
      {/* Sayfa başlığı */}
      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          Biz Kimiz
        </h1>
        <p className="text-muted-foreground">
          Yatta.com.tr olarak, deniz tutkunlarına ve tatil severlere unutulmaz
          deneyimler sunmak için yola çıktık. Mersin&apos;den başlayan yolculuğumuzda,
          her misafirimizin hayalindeki tatili gerçeğe dönüştürmeyi hedefliyoruz.
        </p>
      </header>

      {/* Hikayemiz */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Hikayemiz</h2>
        <p>
          Yatta.com.tr, deniz kültürünü ve tatil deneyimlerini dijital dünyaya
          taşıma vizyonuyla doğdu. Eğriçam Marina&apos;nın sıcak atmosferinden
          ilham alarak, yat kiralama, karavan, bungalov ve villa seçeneklerini
          tek bir platformda buluşturduk. Amacımız, her misafirimizin ihtiyacına
          uygun, güvenilir ve kaliteli hizmet sunmak.
        </p>
      </section>

      {/* Misyonumuz */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Misyonumuz</h2>
        <p>
          Misyonumuz, deniz ve tatil tutkunlarına en iyi konaklama ve kiralama
          seçeneklerini sunarak, unutulmaz anılar biriktirmelerine yardımcı
          olmaktır. Teknoloji ile geleneksel hizmet anlayışını birleştirerek,
          müşteri memnuniyetini ön planda tutuyoruz.
        </p>
      </section>

      {/* Vizyonumuz */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Vizyonumuz</h2>
        <p>
          Türkiye&apos;nin önde gelen deniz ve tatil deneyim platformu olmak,
          misafirlerimize her zaman en iyi hizmeti sunmak ve sektörde örnek
          teşkil eden bir marka haline gelmek vizyonumuzdur.
        </p>
      </section>

      {/* Değerlerimiz */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Değerlerimiz</h2>
        <ul className="list-disc list-inside">
          <li>Müşteri odaklı yaklaşım ve hizmet kalitesi</li>
          <li>Güvenilirlik ve şeffaflık</li>
          <li>Deniz kültürüne saygı ve çevre bilinci</li>
          <li>Yenilikçi çözümler ve sürekli gelişim</li>
          <li>Samimi ve sıcak iletişim</li>
        </ul>
      </section>

      {/* İletişim Bilgileri */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Bize Ulaşın</h2>
        <p>
          Sorularınız, önerileriniz veya destek talepleriniz için bizimle
          iletişime geçebilirsiniz. Size yardımcı olmaktan mutluluk duyarız.
        </p>
        <div className="space-y-2">
          <p>
            <strong>Adres:</strong> Eğriçam Marina, Mersin
          </p>
          <p>
            <strong>Telefon:</strong>{' '}
            <a
              href="tel:+905304872333"
              className="text-[#004aad] hover:underline"
            >
              +90 530 487 23 33
            </a>
          </p>
          <p>
            <strong>WhatsApp:</strong>{' '}
            <a
              href="https://wa.me/905304872333"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#004aad] hover:underline"
            >
              +90 530 487 23 33
            </a>
          </p>
          <p>
            <strong>Harita:</strong>{' '}
            <a
              href="https://maps.app.goo.gl/CxGMcXUyCxLbnmut9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#004aad] hover:underline"
            >
              Konumumuzu görüntüle
            </a>
          </p>
        </div>
      </section>
    </section>
  );
}

