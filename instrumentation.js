// Next.js Instrumentation Hook (Sentry için - opsiyonel)
// Bu dosya Next.js tarafından otomatik olarak yüklenir
// Not: Sentry kurulu değilse bu hook çalışmayacak

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation (Sentry kuruluysa)
    // Sentry config dosyası kendi içinde try-catch ile korumalı
    // Not: Sentry kurulu değilse instrumentation.js'den çağrılmayacak
    // Sentry kurulumu için: npm install @sentry/nextjs
    // Sonra instrumentation.js'de import'u aktif edin
    // try {
    //   await import('./sentry.config.js')
    // } catch (error) {
    //   // Sentry kurulu değilse sessizce geç
    // }
  }
  
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation (gerekirse)
    // await import('./sentry-edge.config.js')
  }
}

