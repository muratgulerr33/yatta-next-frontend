import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="max-w-[896px] mx-auto px-[11px] py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-4 tracking-wide">
              MÜŞTERİ İLİŞKİLERİ
            </h2>
            <ul className="space-y-3">
              <li>
                <Link href="/mesafeli-satis-sozlesmesi" className="block text-slate-600 hover:text-slate-900 transition-colors font-light">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </li>
              <li>
                <Link href="/odeme-ve-rezervasyon" className="block text-slate-600 hover:text-slate-900 transition-colors font-light">
                  Ödeme ve Rezervasyon
                </Link>
              </li>
              <li>
                <Link href="/iptal-iade-kosullari" className="block text-slate-600 hover:text-slate-900 transition-colors font-light">
                  İptal / İade Koşulları
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="block text-slate-600 hover:text-slate-900 transition-colors font-light">
                  Gizlilik &amp; KVKK
                </Link>
              </li>
              <li>
                <Link href="/veri-silme-talebi" className="block text-slate-600 hover:text-slate-900 transition-colors font-light">
                  Veri Silme Talebi
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-4 tracking-wide">
              KATEGORİLER
            </h2>
            <ul className="space-y-3">
              <li>
                <Link href="/kiralama" className="block text-slate-600 hover:text-slate-900 transition-colors font-light">
                  Yat &amp; Tekne Kiralama
                </Link>
              </li>
              <li>
                <Link href="/turlar" className="block text-slate-600 hover:text-slate-900 transition-colors font-light">
                  Turlar
                </Link>
              </li>
              <li>
                <Link href="/konaklama" className="block text-slate-600 hover:text-slate-900 transition-colors font-light">
                  Konaklama
                </Link>
              </li>
              <li>
                <Link href="/organizasyon" className="block text-slate-600 hover:text-slate-900 transition-colors font-light">
                  Organizasyonlar
                </Link>
              </li>
              <li>
                <Link href="/satilik" className="block text-slate-600 hover:text-slate-900 transition-colors font-light">
                  Satılık Deniz Araçları
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-4 tracking-wide">
              SOSYAL BAĞLANTILARIMIZ
            </h2>
            <p className="text-sm text-slate-600 mb-6 font-light">
              Yatta'yı sosyal medyada takip edin, yeni tur ve organizasyonları kaçırmayın.
            </p>
            
            {/* Sosyal Medya İkonları (Minimalist - Çerçevesiz) */}
            <div className="flex items-center gap-5 mb-6 text-2xl">
                {/* WhatsApp (Özel Renk) */}
                <a
                  href="https://wa.me/905304872333"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#25D366] hover:scale-110 transition-transform duration-200"
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/yatta"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-700 hover:text-[#E1306C] hover:scale-110 transition-all duration-200"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com/@yatta"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-700 hover:text-black hover:scale-110 transition-all duration-200"
                  aria-label="TikTok"
                >
                  <i className="fab fa-tiktok"></i>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@yatta"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-700 hover:text-[#FF0000] hover:scale-110 transition-all duration-200"
                  aria-label="YouTube"
                >
                  <i className="fab fa-youtube"></i>
                </a>

                {/* Google Maps (Konum) - İkon */}
                <a
                   href="https://maps.google.com/?q=Egricam+Marina+Mersin"
                   target="_blank"
                   rel="noreferrer"
                   className="text-slate-700 hover:text-[#4285F4] hover:scale-110 transition-all duration-200"
                   aria-label="Konum"
                >
                   <i className="fas fa-map-marker-alt"></i>
                </a>
            </div>

            {/* Açık Adres Metni (Opsiyonel, ikonların altında kalsın) */}
            <a
               href="https://maps.google.com/?q=Egricam+Marina+Mersin"
               target="_blank"
               rel="noreferrer"
               className="text-sm text-slate-500 hover:text-[#004aad] transition-colors underline decoration-slate-300 underline-offset-4"
            >
               Eğriçam Marina, Mersin
            </a>
          </section>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter

