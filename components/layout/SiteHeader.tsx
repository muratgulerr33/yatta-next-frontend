
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const mainNavLinks = [
  { href: '/kiralama', label: 'Kiralama' },
  { href: '/turlar', label: 'Turlar' },
  { href: '/konaklama', label: 'Konaklama' },
  { href: '/organizasyon', label: 'Organizasyon' },
  { href: '/satilik', label: 'Satılık' },
]

const iconTriggerClass =
  'flex items-center justify-center bg-transparent border-0 p-0.5 text-slate-700 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 transition-colors'

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isHiddenOnScroll, setIsHiddenOnScroll] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Auth durumu placeholder (şimdilik false)
  const isAuthenticated = false

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const windowWidth = window.innerWidth

      // Desktop'ta (lg ve üzeri) header her zaman görünür
      if (windowWidth >= 1024) {
        setIsHiddenOnScroll(false)
        setLastScrollY(currentY)
        return
      }

      // Sayfa en üstteyse header görünür
      if (currentY <= 0) {
        setIsHiddenOnScroll(false)
        setLastScrollY(currentY)
        return
      }

      // Threshold: 4px
      const scrollDifference = Math.abs(currentY - lastScrollY)

      if (scrollDifference < 4) {
        return
      }

      // Aşağı scroll → gizle
      if (currentY > lastScrollY) {
        setIsHiddenOnScroll(true)
      }
      // Yukarı scroll → göster
      else {
        setIsHiddenOnScroll(false)
      }

      setLastScrollY(currentY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-sm transition-transform duration-300 ${
        isHiddenOnScroll ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <nav
        className="page-shell flex items-center justify-between h-[56px] lg:h-[64px] px-4 sm:px-6 lg:px-8"
        aria-label="Ana navigasyon"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Ana sayfaya git">
          <Image
            src="/yatta-header-primary.svg"
            alt="YATTA"
            width={112}
            height={28}
            priority
            className="h-6 w-auto lg:h-7 block"
          />
        </Link>

        {/* Desktop Navigasyon */}
        <div className="hidden lg:flex items-center gap-6 text-sm">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-700 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Sağ Blok - Aksiyon İkonları */}
        <div className="flex items-center gap-3">
          {/* Arama Butonu */}
          <button
            type="button"
            className={iconTriggerClass}
            aria-label="Site içinde ara"
          >
            <Image
              src="/icons/icon-search.svg"
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 block"
              aria-hidden="true"
            />
          </button>

          {/* Profil Butonu */}
          {isAuthenticated ? (
            <Link
              href="/profil"
              className={iconTriggerClass}
              aria-label="Profil sayfasına git"
            >
              <Image
                src="/icons/icon-user.svg"
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 block"
                aria-hidden="true"
              />
            </Link>
          ) : (
            <Link
              href="/login"
              className={iconTriggerClass}
              aria-label="Giriş yap"
            >
              <Image
                src="/icons/icon-user.svg"
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 block"
                aria-hidden="true"
              />
            </Link>
          )}

          {/* Hamburger Menü Butonu - Sadece Mobilde */}
          <button
            type="button"
            className={`lg:hidden ${iconTriggerClass}`}
            aria-label={isMobileMenuOpen ? 'Ana menüyü kapat' : 'Ana menüyü aç'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Image
              src="/icons/icon-menu.svg"
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 block"
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>

      {/* Mobil Menü Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-x-0 top-[56px] z-20 bg-white border-t border-slate-200 shadow-lg"
          role="menu"
          aria-label="Mobil navigasyon menüsü"
        >
          <div className="page-shell px-4 sm:px-6 lg:px-8 py-4">
            {/* Kategoriler Bölümü */}
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Kategoriler
              </h2>
              <nav className="flex flex-col gap-1">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                    role="menuitem"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Hesap Bölümü */}
            <div className="border-t border-slate-200 pt-4">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Hesap
              </h2>
              <nav className="flex flex-col gap-1">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profil"
                      className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                      role="menuitem"
                      onClick={closeMobileMenu}
                    >
                      Profilim
                    </Link>
                    <Link
                      href="/rezervasyonlarim"
                      className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                      role="menuitem"
                      onClick={closeMobileMenu}
                    >
                      Rezervasyonlarım
                    </Link>
                    <Link
                      href="/logout"
                      className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                      role="menuitem"
                      onClick={closeMobileMenu}
                    >
                      Çıkış Yap
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                      role="menuitem"
                      onClick={closeMobileMenu}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 font-medium text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                      role="menuitem"
                      onClick={closeMobileMenu}
                    >
                      Kayıt Ol
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
