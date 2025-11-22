// app/yakindayiz/page.jsx
import Image from 'next/image'

export default function YakindayizPage() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-white text-gray-900">
      <div className="w-full text-center space-y-6">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/yatta-icon.webp"
            alt="Yatta Icon"
            width={200}
            height={200}
            className="w-[200px] h-auto mx-auto drop-shadow-lg"
            priority
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Yatta.com.tr 🚤</h1>
        <p className="text-lg md:text-2xl mb-8 opacity-90">
          Tatil, deniz ve organizasyon dünyasında çok yakında online!  
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center w-full max-w-md mx-auto px-4">
          <a 
            href="tel:+905304872333" 
            className="flex items-center justify-center w-full py-3.5 bg-[#004aad] text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:bg-[#003380] hover:shadow-blue-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Ara
          </a>
          <a 
            href="https://wa.me/905304872333" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center w-full py-3.5 bg-[#25D366] text-white rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 hover:bg-[#1DA851] hover:shadow-green-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            WhatsApp
          </a>
        </div>
        
        {/* Sosyal Medya İkonları */}
        <div className="flex gap-4 text-2xl mb-10 justify-center">
          <a 
            href="https://maps.app.goo.gl/CxGMcXUyCxLbnmut9" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-110 transition"
          >
            <i className="fab fa-google text-3xl"></i>
          </a>
          <a 
            href="https://facebook.com/yattacomtr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-110 transition"
          >
            <i className="fab fa-facebook-f text-3xl"></i>
          </a>
          <a 
            href="https://instagram.com/yattacomtr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-110 transition"
          >
            <i className="fab fa-instagram text-3xl"></i>
          </a>
          <a 
            href="https://tiktok.com/@yattacomtr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-110 transition"
          >
            <i className="fab fa-tiktok text-3xl"></i>
          </a>
          <a 
            href="https://youtube.com/@yattacomtr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-110 transition"
          >
            <i className="fab fa-youtube text-3xl"></i>
          </a>
        </div>
        
        {/* Terimler Sözlüğü – mock içerik (scroll testi için) */}
        <div className="w-full mt-10 max-w-2xl mx-auto space-y-6 text-left">
          <h2 className="text-xl font-semibold">
            TERİMLER SÖZLÜĞÜ
          </h2>

          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Component</li>
            <li>Layout</li>
            <li>page.tsx</li>
            <li>Tailwind</li>
          </ul>

          <h2 className="text-lg font-semibold mt-8">
            1. Component
          </h2>
          <p>
            Component, React ve Next.js dünyasında arayüzün en küçük tekrar
            kullanılabilir parçasıdır. Bir buton, kart, form alanı veya header
            gibi gördüğümüz her parça aslında birer component olabilir. Her
            component kendi içinde HTML yapısını, stilini ve bazen de basit
            davranışlarını (event, onClick vb.) saklar. Böylece aynı görünümü
            tekrar tekrar yazmak yerine, tek bir component'i birçok yerde
            kullanabiliriz. Bu da kodu hem daha düzenli hem de daha kolay
            yönetilebilir hale getirir. Component'ler genelde props alır ve bu
            props'lara göre farklı içerik veya stil gösterebilir.
          </p>

          <h2 className="text-lg font-semibold mt-8">
            2. Layout
          </h2>
          <p>
            Layout, bir sayfanın iskeletini ve tekrar eden büyük yapısını
            tanımlayan şablondur. Örneğin her sayfada aynı kalan header, footer
            ve ana içerik alanını (main) tek tek her sayfaya yazmak yerine, bir
            layout dosyasında toplarız. Next.js App Router'da layout dosyaları
            children prop'u üzerinden iç sayfaları sarar ve onlara ortak bir
            çerçeve sağlar. Böylece hem tasarım tutarlı kalır hem de değişiklik
            yapmak çok daha kolay olur. Tek bir layout dosyasında yapılan bir
            güncelleme, o layout'u kullanan tüm sayfalara otomatik yansır.
          </p>

          <h2 className="text-lg font-semibold mt-8">
            3. page.tsx
          </h2>
          <p>
            page.tsx dosyası, Next.js App Router'da bir URL yolunu (route) temsil
            eden temel sayfa bileşenidir. Örneğin app/kiralama/page.tsx dosyası
            /kiralama adresine karşılık gelir. Bu dosyanın içindeki default
            export edilen React component, ziyaretçi o adrese gittiğinde
            gösterilen ana içeriktir. page.tsx içinde sayfaya özel UI, veri
            çekme mantığı (Server Component tarafında) ve gerektiğinde metadata
            tanımları yer alabilir. Yani özetle page.tsx, o route'un "asıl
            ekranı"dır ve layout içinde render edilir.
          </p>

          <h2 className="text-lg font-semibold mt-8">
            4. Tailwind
          </h2>
          <p>
            Tailwind, utility-first yaklaşımıyla çalışan bir CSS framework'üdür.
            Uzun CSS dosyaları yazmak yerine, HTML veya JSX içinde sınıf isimleri
            (className) kullanarak görünümü oluştururuz. Örneğin px-6, py-4,
            text-center, bg-blue-500 gibi class'lar doğrudan padding, hizalama ve
            renk stilini tanımlar. Bu yaklaşım, tasarımı token'lar ve küçük
            parçalar üzerinden yönetmemizi sağlar. Projede tutarlı spacing, renk
            ve tipografi kullanmak kolaylaşır. Build sırasında kullanılmayan
            class'lar silindiği için, ortaya hafif ve performanslı bir CSS
            çıktısı çıkar.
          </p>
        </div>
        
        <p className="mt-12 text-sm opacity-70">© 2025 Yatta.com.tr — Eğriçam Marina, Mersin</p>

        {/* Design System Buttons Demo */}
        <div className="mt-16 p-8 border-t border-gray-200 bg-gray-50 w-full max-w-4xl mx-auto rounded-xl">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Buton Tasarım Sistemi</h3>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            
            {/* Primary Button */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 font-mono">.btn-primary</span>
              <button className="btn-primary">
                Primary Buton
              </button>
            </div>

            {/* Accent Button */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 font-mono">.btn-accent</span>
              <button className="btn-accent">
                Accent Buton
              </button>
            </div>

            {/* Outline / Secondary Style (Tailwind utility ile) */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 font-mono">Border / Secondary</span>
              <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-[#004aad] hover:text-[#004aad] transition-colors">
                Secondary Buton
              </button>
            </div>

            {/* Ghost Button */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 font-mono">Ghost / Text</span>
              <button className="text-gray-600 hover:text-[#004aad] px-6 py-3 font-semibold transition-colors">
                Ghost Buton
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

