// app/yakindayiz/page.jsx
import Image from 'next/image'

export default function YakindayizPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#004aad] to-[#1316d4] text-white text-center px-6">
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
      <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
        <a 
          href="tel:+905304872333" 
          className="bg-white text-[#004aad] px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition"
        >
          📞 Ara
        </a>
        <a 
          href="https://wa.me/905304872333" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-green-500 px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition"
        >
          💬 WhatsApp
        </a>
      </div>
      
      {/* Sosyal Medya İkonları */}
      <div className="flex gap-4 text-2xl mb-10">
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
      
      <p className="mt-12 text-sm opacity-70">© 2025 Yatta.com.tr — Eğriçam Marina, Mersin</p>
    </main>
  );
}

