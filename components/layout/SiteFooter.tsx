import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="max-w-[896px] mx-auto px-[11px] py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              MÜŞTERİ İLİŞKİLERİ
            </h2>
            <ul className="space-y-3">
              <li>
                <Link href="/mesafeli-satis-sozlesmesi" className="block text-slate-600 hover:text-slate-900 transition-colors">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </li>
              <li>
                <Link href="/odeme-ve-rezervasyon" className="block text-slate-600 hover:text-slate-900 transition-colors">
                  Ödeme ve Rezervasyon
                </Link>
              </li>
              <li>
                <Link href="/iptal-iade-kosullari" className="block text-slate-600 hover:text-slate-900 transition-colors">
                  İptal / İade Koşulları
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="block text-slate-600 hover:text-slate-900 transition-colors">
                  Gizlilik &amp; KVKK
                </Link>
              </li>
              <li>
                <Link href="/veri-silme-talebi" className="block text-slate-600 hover:text-slate-900 transition-colors">
                  Veri Silme Talebi
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              KATEGORİLER
            </h2>
            <ul className="space-y-3">
              <li>
                <Link href="/kiralama" className="block text-slate-600 hover:text-slate-900 transition-colors">
                  Yat &amp; Tekne Kiralama
                </Link>
              </li>
              <li>
                <Link href="/turlar" className="block text-slate-600 hover:text-slate-900 transition-colors">
                  Turlar
                </Link>
              </li>
              <li>
                <Link href="/konaklama" className="block text-slate-600 hover:text-slate-900 transition-colors">
                  Konaklama
                </Link>
              </li>
              <li>
                <Link href="/organizasyon" className="block text-slate-600 hover:text-slate-900 transition-colors">
                  Organizasyonlar
                </Link>
              </li>
              <li>
                <Link href="/satilik" className="block text-slate-600 hover:text-slate-900 transition-colors">
                  Satılık Deniz Araçları
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              SOSYAL BAĞLANTILARIMIZ
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Yatta'yı sosyal medyada takip edin, yeni tur ve organizasyonları kaçırmayın.
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/905304872333"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span>💬</span>
                  <span>WhatsApp Destek</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/yatta"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span>📸</span>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@yatta"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span>🎵</span>
                  <span>TikTok</span>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@yatta"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span>▶️</span>
                  <span>YouTube</span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Egricam+Marina+Mersin"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span>📍</span>
                  <span>Konum (Google Maps)</span>
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter

