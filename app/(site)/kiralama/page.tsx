// basit placeholder: 200 döndürsün

export default function Page() {
  return (
    <section className="w-full max-w-2xl mx-auto space-y-10">
      {/* Sayfa başlığı */}
      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          Kiralama
        </h1>
        <p className="text-muted-foreground">
          Yatta.com.tr&apos;de farklı konaklama ve deneyim seçeneklerini tek bir
          çatı altında topluyoruz. Aşağıda, sistemimizin v1 sürümünde
          planladığımız kiralama türleri için örnek açıklamalar ve bilgi
          bloklarını görebilirsin. Bu içerikler tamamen mock veridir; gerçek
          canlı yayına geçerken, burada yer alan metinler kolayca güncellenip
          marka diline uyarlanacaktır.
        </p>
      </header>

      {/* Yat kiralama */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Yat kiralama</h2>
        <p>
          Yat kiralama, denizde özgürce vakit geçirmek, koy koy gezmek ve
          misafirlerine özel bir deneyim sunmak isteyenler için en premium
          kiralama modelidir. Bu mock metinde; tekne tipi, kapasite, kalkış
          limanı, rota seçenekleri ve mürettebat hizmetleri gibi başlıkları
          temsil eden örnek bir açıklama yer alıyor. Gerçek içerikte; günlük,
          haftalık, özel gün ve etkinlik paketleri gibi farklı senaryolar
          tanımlanabilir. Kullanıcılar; tarih, kişi sayısı ve bütçeye göre
          filtreleme yaparak kendilerine en uygun yat seçeneğini listeleyebilir.
          Yat kiralama akışında, sözleşme adımları, ödeme seçenekleri ve iptal
          koşulları gibi detaylar da ayrı bölümler olarak açıklanabilir.
        </p>
        <ul className="list-disc list-inside">
          <li>Günlük ve haftalık yat kiralama senaryoları.</li>
          <li>Koy ve rota önerileri için örnek içerik alanı.</li>
          <li>Mürettebatlı / mürettebatsız seçenekleri için bilgi blokları.</li>
          <li>Özel etkinlikler (doğum günü, evlilik teklifi, kurumsal davet).</li>
        </ul>
      </section>

      {/* Karavan kiralama */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Karavan kiralama</h2>
        <p>
          Karavan kiralama, özgür rotalar çizmek ve doğayla iç içe esnek bir
          tatil planlamak isteyen kullanıcılar için tasarlanmış bir kiralama
          modelidir. Bu mock metin; karavan tipleri, kişi kapasitesi, iç
          donanım, kamp alanı önerileri ve yol planlama notları gibi başlıkları
          temsil eder. Gerçek senaryoda; kullanıcılar başlangıç şehrini, teslim
          ve iade noktalarını, kilometre sınırı ve depozito koşullarını bu
          ekrandan net bir şekilde görebilir. Karavan kiralama akışında; kamp
          ekipmanları, ekstra sürücü, evcil hayvan politikası gibi ek
          seçenekler de liste halinde sunulabilir. Böylece kullanıcı, rezervasyon
          öncesinde ihtiyaç duyduğu tüm bilgileri tek ekranda toplu olarak
          inceleyebilir.
        </p>
        <ul className="list-disc list-inside">
          <li>Farklı karavan tipleri (campervan, çekme karavan vb.).</li>
          <li>Kamp alanı ve rota önerileri için mock alan.</li>
          <li>Depozito, kilometre sınırı ve sigorta bilgisi.</li>
          <li>Ek hizmetler: kamp ekipmanı, masa-sandalye, çocuk koltuğu vb.</li>
        </ul>
      </section>

      {/* Bungalov kiralama */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Bungalov kiralama</h2>
        <p>
          Bungalov kiralama, doğa oteli konforunu daha butik ve sıcak bir
          ortamda sunan konaklama modelini temsil eder. Bu mock içerikte; oda
          özellikleri, manzara tipleri, kahvaltı ve yemek seçenekleri, şömine ve
          jakuzi gibi özel donanımlar için örnek açıklamalar yer alır. Gerçek
          uygulamada; kullanıcılar tarih aralığına göre müsait bungalovları
          listeleyebilir ve filtrelerle; deniz manzarası, orman içi, göl
          kenarı gibi seçenekleri daraltabilir. Ayrıca, fotoğraf galerisi,
          misafir yorumları ve puanlama sistemi gibi alanlar da bu sayfaya
          entegre edilebilir. Bungalov kiralama başlığı altında, çiftler,
          aileler veya kalabalık gruplar için farklı konseptler mock olarak
          temsil edilebilir.
        </p>
        <ul className="list-disc list-inside">
          <li>Oda tipleri ve kişi kapasitesi için bilgi alanları.</li>
          <li>Manzara, konum ve konsept filtreleri.</li>
          <li>Şömine, jakuzi, bahçe kullanımı gibi ek özellikler.</li>
          <li>Misafir değerlendirmeleri ve puanlama bölümü için placeholder.</li>
        </ul>
      </section>

      {/* Villa kiralama */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">Villa kiralama</h2>
        <p>
          Villa kiralama, özellikle kalabalık aileler ve arkadaş grupları için
          geniş yaşam alanı, özel havuz ve yüksek mahremiyet sunan bir kiralama
          seçeneğidir. Bu mock metin; oda sayısı, banyo sayısı, havuz ölçüleri,
          bahçe kullanımı, otopark ve güvenlik gibi başlıkları simüle eder.
          Gerçek uygulamada; kullanıcılar bölge, fiyat aralığı ve kişi sayısına
          göre villa filtreleyebilir, her villa için detaylı fotoğraf galerisi
          ve kat planı inceleyebilir. Villa kiralama akışında ayrıca; temizlik
          sıklığı, ekstra havlu-çarşaf hizmeti ve erken/ geç check-in gibi
          opsiyonlar da bilgi olarak sunulabilir. Bu bölüm, v1 için tamamen mock
          olarak kullanılsa da, ilerleyen sürümlerde gerçek veritabanı
          içerikleriyle beslenmeye hazır bir iskelet niteliği taşır.
        </p>
        <ul className="list-disc list-inside">
          <li>Oda ve banyo sayısı için yapılandırılabilir alanlar.</li>
          <li>Özel havuz, bahçe ve otopark bilgisi.</li>
          <li>Bölge ve fiyat filtresiyle çalışan listeleme senaryosu.</li>
          <li>Ek hizmetler: temizlik, şef, transfer gibi opsiyonlar.</li>
        </ul>
      </section>
    </section>
  );
}

