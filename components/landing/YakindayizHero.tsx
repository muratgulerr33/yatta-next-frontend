// components/landing/YakindayizHero.tsx
// Yakındayız sayfası hero komponenti - logo, başlık, CTA butonları, sosyal medya ikonları ve kategori slider içerir
import Image from 'next/image'
import { MOCK_CATEGORIES } from '@/data/mockCategories';
import { CategoryShowcase } from '@/components/ui/CategoryShowcase';

export function YakindayizHero() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 py-12">
      <div className="w-full max-w-7xl mx-auto text-center space-y-6 px-4">
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

        {/* WhatsApp & Ara Butonları */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center w-full max-w-md mx-auto">
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
        <div className="flex gap-4 text-2xl mb-12 justify-center">
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

        {/* Category Showcase Slider */}
        <div className="w-full mb-16">
          <CategoryShowcase 
            categories={MOCK_CATEGORIES}
          />
        </div>
        
        {/* Footer */}
        <p className="mt-12 text-sm opacity-70">© 2025 Yatta.com.tr — Eğriçam Marina, Mersin</p>
      </div>
    </section>
  );
}
