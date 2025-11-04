'use client'

// Custom error boundary component (500, runtime errors)
import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to console (production'da Sentry'ye gönderilecek)
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="text-center max-w-lg mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-extrabold text-red-400 mb-4">
          ⚠️
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-300">
          Bir Hata Oluştu
        </h2>
        <p className="text-gray-400 mb-8">
          Üzgünüz, beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </p>
        {process.env.NODE_ENV === 'development' && error?.message && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
            <p className="text-sm text-red-300 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Tekrar Dene
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  )
}

