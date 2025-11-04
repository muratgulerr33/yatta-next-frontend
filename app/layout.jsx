import localFont from 'next/font/local'
import './globals.css'
import { AppStateProvider } from '@/contexts/AppStateContext'

// Font Awesome CSS - tüm ikonlar için
import '@fortawesome/fontawesome-free/css/all.css'

// React Icons otomatik olarak çalışır, import gerekmez (kullanıldığı yerde import edilir)

// Nunito font ailesi tanımı (Regular / SemiBold / Bold)
// next/font ile fontlar self-hosted olur, performans artar
const nunito = localFont({
  src: [
    { path: '../public/fonts/Nunito-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Nunito-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/Nunito-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-nunito',
  display: 'swap', // CLS önleme
})

const BASE_URL = 'https://yatta.com.tr'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Yatta - Yakında',
    template: '%s | Yatta',
  },
  description: 'Yeni Yatta deneyimine hazır olun! Tatil, deniz ve organizasyon dünyasında çok yakında online!',
  keywords: ['yatta', 'tatil', 'deniz', 'organizasyon', 'marina', 'mersin', 'eğriçam'],
  authors: [{ name: 'Yatta' }],
  creator: 'Yatta',
  publisher: 'Yatta',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: BASE_URL,
    siteName: 'Yatta',
    title: 'Yatta - Yakında',
    description: 'Yeni Yatta deneyimine hazır olun! Tatil, deniz ve organizasyon dünyasında çok yakında online!',
    images: [
      {
        url: '/yatta-icon.webp',
        width: 1200,
        height: 630,
        alt: 'Yatta Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yatta - Yakında',
    description: 'Yeni Yatta deneyimine hazır olun!',
    images: ['/yatta-icon.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console ve diğer arama motorları için verification kodları
    // İhtiyaç duyulduğunda eklenecek
    // google: 'verification-code',
  },
}

// Root layout için cache ayarları
export const revalidate = 3600 // 1 saat ISR (Incremental Static Regeneration)

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${nunito.className} antialiased bg-light text-primary`}>
        <AppStateProvider>
          {children}
        </AppStateProvider>
      </body>
    </html>
  )
}

