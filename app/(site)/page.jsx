// app/(site)/page.jsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Mock data (Gemini direktifine uygun)
const FEATURED_BOATS = [
  {
    id: "princess-45-fly",
    name: "Princess 45 Fly",
    location: "Mersin / Marina",
    price: 3500000,
    image: "/images/hero-desktop.webp",
  },
  {
    id: "azimut-55",
    name: "Azimut 55",
    location: "Mersin / Yenişehir",
    price: 12500000,
    image: "/images/hero-mobile.webp",
  },
];

const COMING_SOON = [
  {
    id: "organizasyon",
    title: "Özel Organizasyonlar",
    image: "/images/coming-soon-organization.webp",
  },
  {
    id: "mavi-tur",
    title: "VIP Mavi Turlar",
    image: "/images/hero-desktop.webp",
  },
];

// Projede kullanılan numarayla hizalı
const WHATSAPP_URL = "https://wa.me/905304872333";

function formatTRY(amount) {
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} TL`;
}

export default function HomePage() {
  // Ref'ler sadece client-side kullanılacak (hydration mismatch'i önlemek için)
  const [isMounted, setIsMounted] = useState(false);
  const heroContentRef = useRef(null);
  const pageShellRef = useRef(null);
  const mobileImageRef = useRef(null);
  const desktopImageRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Client-side'da çalıştır
    // #region agent log
    const logData = {
      sessionId: 'debug-session',
      runId: 'run1',
      timestamp: Date.now(),
    };

    // Measure hero content alignment
    if (heroContentRef.current && pageShellRef.current) {
      const heroRect = heroContentRef.current.getBoundingClientRect();
      const pageShellRect = pageShellRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const isMobile = windowWidth < 768;
      const isDesktop = windowWidth >= 768;

      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...logData,
          hypothesisId: 'A',
          location: 'page.jsx:useEffect',
          message: 'Hero content vs page-shell alignment',
          data: {
            heroLeft: heroRect.left,
            pageShellLeft: pageShellRect.left,
            alignmentDiff: Math.abs(heroRect.left - pageShellRect.left),
            windowWidth,
            isMobile,
            isDesktop,
            heroMaxWidth: heroContentRef.current.style.maxWidth || '896px',
          },
        }),
      }).catch(() => {});
    }

    // Measure mobile image visibility
    if (mobileImageRef.current) {
      const mobileRect = mobileImageRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const isMobile = windowWidth < 768;

      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...logData,
          hypothesisId: 'C',
          location: 'page.jsx:useEffect',
          message: 'Mobile image visibility check',
          data: {
            mobileImageVisible: mobileRect.width > 0 && mobileRect.height > 0,
            mobileImageWidth: mobileRect.width,
            mobileImageHeight: mobileRect.height,
            windowWidth,
            isMobile,
            computedDisplay: window.getComputedStyle(mobileImageRef.current).display,
          },
        }),
      }).catch(() => {});
    }

    // Measure desktop image visibility
    if (desktopImageRef.current) {
      const desktopRect = desktopImageRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const isDesktop = windowWidth >= 768;

      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...logData,
          hypothesisId: 'C',
          location: 'page.jsx:useEffect',
          message: 'Desktop image visibility check',
          data: {
            desktopImageVisible: desktopRect.width > 0 && desktopRect.height > 0,
            desktopImageWidth: desktopRect.width,
            desktopImageHeight: desktopRect.height,
            windowWidth,
            isDesktop,
            computedDisplay: window.getComputedStyle(desktopImageRef.current).display,
          },
        }),
      }).catch(() => {});
    }

    // Measure container widths and padding
    if (heroContentRef.current) {
      const computedStyle = window.getComputedStyle(heroContentRef.current);
      const windowWidth = window.innerWidth;

      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...logData,
          hypothesisId: 'B',
          location: 'page.jsx:useEffect',
          message: 'Hero container dimensions and padding',
          data: {
            heroPaddingLeft: computedStyle.paddingLeft,
            heroPaddingRight: computedStyle.paddingRight,
            heroMaxWidth: computedStyle.maxWidth,
            heroWidth: computedStyle.width,
            windowWidth,
          },
        }),
      }).catch(() => {});
    }

    if (pageShellRef.current) {
      const computedStyle = window.getComputedStyle(pageShellRef.current);
      const windowWidth = window.innerWidth;

      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...logData,
          hypothesisId: 'B',
          location: 'page.jsx:useEffect',
          message: 'Page-shell container dimensions and padding',
          data: {
            pageShellPaddingLeft: computedStyle.paddingLeft,
            pageShellPaddingRight: computedStyle.paddingRight,
            pageShellMaxWidth: computedStyle.maxWidth,
            pageShellWidth: computedStyle.width,
            windowWidth,
          },
        }),
      }).catch(() => {});
    }
    // #endregion
  }, [isMounted]);

  return (
    <div className="w-full font-[var(--font-inter)]">
      {/* 1) HERO BANNER (Container-in-Full-Background yapısı) */}
      <section className="relative w-full h-[90vh] overflow-hidden">
        {/* Arkaplan (full-bleed) */}
        <div className="absolute inset-0 z-0">
          <div ref={isMounted ? mobileImageRef : null} className="block md:hidden absolute inset-0 w-full h-full">
            <Image
              src="/images/hero-mobile.webp"
              alt="Lüks tekne manzarası"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div ref={isMounted ? desktopImageRef : null} className="hidden md:block absolute inset-0 w-full h-full">
            <Image
              src="/images/hero-desktop.webp"
              alt="Lüks yat manzarası"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* İçerik (page-shell genişliği, dikey ortalı) */}
        <div ref={isMounted ? heroContentRef : null} className="relative z-10 w-full max-w-[896px] mx-auto px-5 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="flex flex-col items-start text-left gap-6 lg:gap-8">
            <div className="space-y-4 lg:space-y-5">
              <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-xl">
                Hayallerindeki Tekneye Ulaş
              </h1>
              <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl">
                Mersin'in en seçkin satılık tekne ve yat portföyü.
              </p>
            </div>

            <Link
              href="/satilik-tekneler"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all shadow-lg shadow-blue-900/20"
              aria-label="Satılık tekne ilanlarını incele"
            >
              İlanları İncele
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2) VİTRİN (Mobile scroll → Desktop grid) */}
      <section ref={isMounted ? pageShellRef : null} className="page-shell py-16 px-5 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Öne Çıkan Fırsatlar
        </h2>

        <div className="grid grid-cols-2 gap-4 md:gap-8 items-stretch">
          {FEATURED_BOATS.map((boat) => (
            <article key={boat.id} className="flex flex-col h-full">
              <Link href="/satilik-tekneler" className="flex flex-col h-full" aria-label={`${boat.name} ilanlarına git`}>
                <div className="aspect-[4/3] relative w-full overflow-hidden rounded-2xl shadow-sm bg-gray-100">
                  <Image
                    src={boat.image}
                    alt={`${boat.name} fotoğrafı`}
                    fill
                    sizes="(min-width: 768px) 50vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>

                <div className="flex flex-col flex-1 p-4">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{boat.name}</h3>
                  <div className="text-sm text-gray-500 mb-2 truncate">
                    <span>{boat.location}</span>
                  </div>
                  <span className="mt-auto text-xl font-bold text-blue-600">{formatTRY(boat.price)}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 3) COMING SOON */}
      <section className="page-shell pb-16 px-5 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Çok Yakında</h2>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {COMING_SOON.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 aspect-[4/3]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 520px, 45vw"
                className="object-cover opacity-90 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  YAKINDA
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10">
                <p className="text-white font-semibold drop-shadow">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4) PRE-FOOTER (GÜVEN & WHATSAPP) */}
      <section className="page-shell mb-12 px-5 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-blue-100">
          {/* Dekoratif ikon (mascot yerine güvenli asset) */}
          <Image
            src="/yatta-icon.webp"
            alt=""
            aria-hidden="true"
            width={260}
            height={260}
            className="absolute -left-10 -bottom-10 opacity-15 pointer-events-none select-none"
          />

          <p className="text-xl md:text-2xl font-bold text-gray-900 relative z-10">
            Aklına takılanları Kaptan&apos;a sorabilirsin.
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-2 bg-green-500 text-white font-semibold px-6 py-3 rounded-full transition-colors hover:bg-green-600"
            aria-label="WhatsApp üzerinden iletişime geç"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp&apos;tan Yaz
          </a>
        </div>
      </section>
    </div>
  );
}

