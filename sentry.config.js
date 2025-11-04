// Sentry Configuration for Next.js SSR (Opsiyonel)
// Kurulum: npm install @sentry/nextjs
// Setup: npx @sentry/wizard@latest -i nextjs
// Not: Sentry kurulu değilse bu dosya çalışmayacak

try {
  // Dynamic import ile Sentry'yi yükle (kurulu değilse hata vermez)
  const Sentry = require('@sentry/nextjs')
  
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
    
    // Environment
    environment: process.env.NODE_ENV || 'production',
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session replay (opsiyonel)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Error filtering
    beforeSend(event, hint) {
      // Production'da hassas bilgileri filtrele
      if (process.env.NODE_ENV === 'production') {
        // Remove sensitive data
        if (event.request) {
          delete event.request.cookies
          delete event.request.headers?.authorization
        }
      }
      return event
    },
    
    // Ignore certain errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
  })
} catch (error) {
  // Sentry kurulu değilse sessizce geç
  console.log('[Sentry] Not configured, skipping initialization...')
}

