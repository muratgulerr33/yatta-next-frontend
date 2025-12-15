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
import MobileNavWrapper from '@/components/layout/MobileNavWrapper'

// Font Awesome CSS - tüm ikonlar için
import '@fortawesome/fontawesome-free/css/all.css'

// React Icons otomatik olarak çalışır, import gerekmez (kullanıldığı yerde import edilir)

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Yatta – Yat Kiralama, Mavi Tur ve Tekne İlanları',
  description:
    'Yatta, yat kiralama, mavi tur, tekne turları, organizasyonlar ve satılık tekneler için akıllı arama ve ilan platformudur. Kategorilere göre tekneleri keşfet, favorilerine ekle ve güvenle iletişime geç.',
  keywords: ['yatta', 'yat kiralama', 'mavi tur', 'tekne turları', 'organizasyon', 'satılık tekneler', 'marina', 'mersin', 'eğriçam'],
  authors: [{ name: 'Yatta' }],
  creator: 'Yatta',
  publisher: 'Yatta',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Yatta – Yat Kiralama, Mavi Tur ve Tekne İlanları',
    description:
      'Yatta, yat kiralama, mavi tur, tekne turları, organizasyonlar ve satılık tekneler için akıllı arama ve ilan platformudur.',
    url: 'https://yatta.com.tr/',
    siteName: 'Yatta',
    type: 'website',
    locale: 'tr_TR',
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
    title: 'Yatta – Yat Kiralama, Mavi Tur ve Tekne İlanları',
    description:
      'Yatta, yat kiralama, mavi tur, tekne turları, organizasyonlar ve satılık tekneler için akıllı arama ve ilan platformudur.',
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
      <body className="font-sans antialiased bg-light text-primary min-h-screen flex flex-col overflow-x-hidden">
        <AppStateProvider>
          <AuthProvider>
            <HelinChatProvider>
              <SiteHeader />
              <main className="flex-1 px-[11px] pb-[100px] md:pb-24">
                {children}
              </main>
              <div className="pb-[calc(env(safe-area-inset-bottom)+6rem)] md:pb-0">
                <SiteFooter />
              </div>
              <MobileNavWrapper />
            </HelinChatProvider>
          </AuthProvider>
        </AppStateProvider>
      </body>
    </html>
  )
}

