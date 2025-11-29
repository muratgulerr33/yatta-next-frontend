/* eslint-disable react-refresh/only-export-components */
import { Inter } from "next/font/google"
import './globals.css'
import { AppStateProvider } from '@/contexts/AppStateContext'
import { HelinChatProvider } from '@/contexts/HelinChatContext'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
})

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { HelinChatRoot } from '@/components/helin/HelinChatRoot'

// Font Awesome CSS - tüm ikonlar için
import '@fortawesome/fontawesome-free/css/all.css'

// React Icons otomatik olarak çalışır, import gerekmez (kullanıldığı yerde import edilir)

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
    <html lang="tr" data-theme="light" className={inter.variable}>
      <body className="font-sans antialiased bg-light text-primary min-h-screen flex flex-col">
        <AppStateProvider>
          <AuthProvider>
            <HelinChatProvider>
              <SiteHeader />
              <main className="flex-1 px-[11px]">
                {children}
              </main>
              <SiteFooter />
              <HelinChatRoot />
            </HelinChatProvider>
          </AuthProvider>
        </AppStateProvider>
      </body>
    </html>
  )
}

