
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const mainNavLinks = [
  { href: '/kiralama', label: 'Kiralama' },
  { href: '/turlar', label: 'Turlar' },
  { href: '/konaklama', label: 'Konaklama' },
  { href: '/organizasyon', label: 'Organizasyon' },
  { href: '/satilik-tekneler', label: 'Satılık Tekneler' },
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

  // Body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-transform duration-300 ${
          isHiddenOnScroll ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <nav
          className="page-shell flex items-center justify-between h-[56px] lg:h-[64px] pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8"
          aria-label="Ana navigasyon"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50" aria-label="Ana sayfaya git" onClick={closeMobileMenu}>
            <Image
              src="/yatta-header-primary.svg"
              alt="YATTA"
              width={112}
              height={28}
              priority
              className="h-8 w-auto lg:h-10 block"
            />
          </Link>

          {/* Desktop Navigasyon */}
          <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-[#004aad] transition-colors relative group py-2"
              >
                {link.label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#004aad] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            ))}
          </div>

          {/* Sağ Blok - Aksiyon İkonları */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Arama Butonu */}
            <button
              type="button"
              className={iconTriggerClass}
              aria-label="Site içinde ara"
            >
              <Image
                src="/icons/icon-search.svg"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6 block text-slate-900 drop-shadow-sm hover:scale-105 transition-transform"
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
                  width={24}
                  height={24}
                  className="w-6 h-6 block text-slate-900 drop-shadow-sm hover:scale-105 transition-transform"
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
                  width={24}
                  height={24}
                  className="w-6 h-6 block text-slate-900 drop-shadow-sm hover:scale-105 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            )}

            {/* Hamburger Menü Butonu */}
            <button
              type="button"
              className={`lg:hidden ${iconTriggerClass} ml-1`}
              aria-label="Ana menüyü aç"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Image
                src="/icons/icon-menu.svg"
                alt=""
                width={28}
                height={28}
                className="w-7 h-7 block text-slate-900 drop-shadow-sm hover:scale-105 transition-transform"
                aria-hidden="true"
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Modern Mobile Menu Overlay (2025 Style) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'visible' : 'invisible delay-500'
        }`}
      >
        {/* Backdrop (Blurry) */}
        <div
          className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* Sliding Panel (Left to Right) */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-[360px] bg-white shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header of Drawer */}
          <div className="flex items-center justify-between pl-[calc(var(--spacing)*4.5)] pr-4 h-[64px] border-b border-slate-100">
            <Link href="/" onClick={closeMobileMenu} className="relative left-1">
              <Image
                src="/yatta-header-primary.svg"
                alt="YATTA"
                width={100}
                height={25}
                className="h-7 w-auto"
              />
            </Link>
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              onClick={closeMobileMenu}
              aria-label="Menüyü kapat"
            >
              {/* X Icon (SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto h-[calc(100%-64px)] px-6 py-8 flex flex-col justify-between">
            
            {/* Main Links */}
            <nav className="space-y-6">
              <div>
                <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 pl-1">
                  Keşfet
                </h2>
                <div className="flex flex-col space-y-1">
                  {mainNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-2xl font-bold text-slate-800 hover:text-[#004aad] hover:translate-x-2 transition-all duration-300 py-2"
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Footer Actions */}
            <div className="space-y-6 mt-8 border-t border-slate-100 pt-8">
              <div>
                <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 pl-1">
                  Hesabım
                </h2>
                <div className="grid gap-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profil"
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-700 font-semibold hover:bg-[#004aad] hover:text-white transition-all"
                        onClick={closeMobileMenu}
                      >
                        <span className="text-lg">👤</span> Profilim
                      </Link>
                      <Link
                        href="/logout"
                        className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-600 hover:text-white transition-all"
                        onClick={closeMobileMenu}
                      >
                        <span className="text-lg">🚪</span> Çıkış Yap
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center justify-center w-full py-3.5 border-2 border-slate-200 rounded-xl text-slate-700 font-bold hover:border-slate-900 hover:text-slate-900 transition-all"
                        onClick={closeMobileMenu}
                      >
                        Giriş Yap
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center justify-center w-full py-3.5 bg-[#004aad] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#003380] hover:shadow-blue-900/30 transition-all"
                        onClick={closeMobileMenu}
                      >
                        Ücretsiz Kayıt Ol
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Social / Contact Hint */}
              <div className="flex items-center justify-center gap-6 pt-4 opacity-50">
                 <span className="text-xs font-medium text-slate-400">© 2025 Yatta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
