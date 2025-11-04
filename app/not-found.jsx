// Custom 404 Not Found page
export const metadata = {
  title: '404 - Sayfa Bulunamadı | Yatta',
  description: 'Aradığınız sayfa bulunamadı.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold text-fuchsia-400 mb-4 neon-glow">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-300">
          Sayfa Bulunamadı
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  )
}

