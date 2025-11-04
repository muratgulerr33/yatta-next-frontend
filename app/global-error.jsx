'use client'

// Global error boundary (root layout hataları için)
export default function GlobalError({ error, reset }) {
  return (
    <html lang="tr">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
          <div className="text-center max-w-lg mx-auto px-4">
            <h1 className="text-6xl md:text-8xl font-extrabold text-red-400 mb-4">
              🚨
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-300">
              Kritik Hata
            </h2>
            <p className="text-gray-400 mb-8">
              Uygulama başlatılamadı. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Yeniden Başlat
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

