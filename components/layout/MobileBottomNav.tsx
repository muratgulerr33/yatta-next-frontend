'use client';

// /home/yatta/apps/frontend/components/layout/MobileBottomNav.tsx
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon as HomeOutline,
  HeartIcon as HeartOutline,
  PlusIcon,
  ChatBubbleLeftRightIcon as ChatOutline,
  UserCircleIcon as UserOutline,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  HeartIcon as HeartSolid,
  ChatBubbleLeftRightIcon as ChatSolid,
  UserCircleIcon as UserSolid,
} from '@heroicons/react/24/solid';

type Props = {
  // Badge desteği (şimdilik placeholder)
  unreadCount?: number;
};

function isActivePath(pathname: string, href: string) {
  // Plan gereksinimlerine göre active state logic:
  // - `/profil` → sadece "Hesabım" aktif (alt route'lar değil)
  // - `/profil/favoriler` → "Favoriler" aktif
  // - `/mesajlar` veya `/profil/mesajlar` → "Mesajlar" aktif
  // - `/ilan-ver/satilik-tekne` → "İlan Ver" aktif
  // - `/` → "Keşfet" aktif
  
  if (href === '/') return pathname === '/';
  
  // Profil için özel kontrol: sadece tam eşleşme
  if (href === '/profil') return pathname === '/profil';
  
  // Mesajlar için hem /mesajlar hem /profil/mesajlar kontrolü
  if (href === '/mesajlar') {
    return pathname.startsWith('/mesajlar') || pathname.startsWith('/profil/mesajlar');
  }
  
  // Diğer route'lar için normal kontrol
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileBottomNav({ unreadCount = 0 }: Props) {
  const pathname = usePathname();

  const tabs = [
    { key: 'home', label: 'Keşfet', href: '/', IconO: HomeOutline, IconS: HomeSolid },
    { key: 'fav', label: 'Favoriler', href: '/profil/favoriler', IconO: HeartOutline, IconS: HeartSolid },
    // Ortadaki FAB ayrı
    { key: 'msg', label: 'Mesajlar', href: '/mesajlar', IconO: ChatOutline, IconS: ChatSolid, badge: unreadCount },
    { key: 'acc', label: 'Hesabım', href: '/profil', IconO: UserOutline, IconS: UserSolid },
  ] as const;

  // Body padding yönetimi (plan gereksinimi)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const originalPadding = document.body.style.paddingBottom;

    const updatePadding = () => {
      if (!mediaQuery.matches) {
        // Mobilde: bottom nav yüksekliği + safe-area
        document.body.style.paddingBottom = 'calc(65px + env(safe-area-inset-bottom))';
      } else {
        // Desktop'ta: eski padding'i restore et
        document.body.style.paddingBottom = originalPadding || '';
      }
    };

    updatePadding();

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // Desktop'a geçiş
        document.body.style.paddingBottom = originalPadding || '';
      } else {
        // Mobil'e geçiş
        document.body.style.paddingBottom = 'calc(65px + env(safe-area-inset-bottom))';
      }
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
      document.body.style.paddingBottom = originalPadding || '';
    };
  }, []);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 z-[999] w-full bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobil alt navigasyon"
    >
      {/* Grid Layout: 5 eşit kolon */}
      <div className="grid grid-cols-5 h-[65px] items-end">
        {/* 1. Keşfet */}
        <Link
          href="/"
          aria-label="Keşfet"
          className="flex flex-col items-center justify-center h-full pb-2 gap-1"
        >
          {isActivePath(pathname, '/') ? (
            <HomeSolid className="w-6 h-6 text-[var(--color-primary)]" />
          ) : (
            <HomeOutline className="w-6 h-6 text-gray-400" />
          )}
          <span
            className={`text-[10px] font-medium ${
              isActivePath(pathname, '/') ? 'text-[var(--color-primary)]' : 'text-gray-400'
            }`}
          >
            Keşfet
          </span>
        </Link>

        {/* 2. Favoriler */}
        <Link
          href="/profil/favoriler"
          aria-label="Favoriler"
          className="flex flex-col items-center justify-center h-full pb-2 gap-1"
        >
          {isActivePath(pathname, '/profil/favoriler') ? (
            <HeartSolid className="w-6 h-6 text-[var(--color-primary)]" />
          ) : (
            <HeartOutline className="w-6 h-6 text-gray-400" />
          )}
          <span
            className={`text-[10px] font-medium ${
              isActivePath(pathname, '/profil/favoriler') ? 'text-[var(--color-primary)]' : 'text-gray-400'
            }`}
          >
            Favoriler
          </span>
        </Link>

        {/* 3. ORTA FAB — İlan Ver (Özel: Yukarı taşan buton) */}
        <div className="relative flex flex-col items-center justify-center">
          <Link
            href="/ilan-ver/satilik-tekne"
            aria-label="İlan ver"
            className="relative -top-5 flex flex-col items-center justify-center"
          >
            {/* Daire FAB */}
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transform transition-transform active:scale-95">
              <PlusIcon className="w-8 h-8" />
            </div>
            {/* Text altında */}
            <span className="text-[10px] font-medium text-gray-500 mt-1">İlan Ver</span>
          </Link>
        </div>

        {/* 4. Mesajlar */}
        <Link
          href="/mesajlar"
          aria-label="Mesajlar"
          className="flex flex-col items-center justify-center h-full pb-2 gap-1 relative"
        >
          {isActivePath(pathname, '/mesajlar') ? (
            <ChatSolid className="w-6 h-6 text-[var(--color-primary)]" />
          ) : (
            <ChatOutline className="w-6 h-6 text-gray-400" />
          )}

          {/* Badge (Mesajlar) */}
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[18px] text-center font-bold"
              aria-label="Okunmamış mesaj sayısı"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}

          <span
            className={`text-[10px] font-medium ${
              isActivePath(pathname, '/mesajlar') ? 'text-[var(--color-primary)]' : 'text-gray-400'
            }`}
          >
            Mesajlar
          </span>
        </Link>

        {/* 5. Hesabım */}
        <Link
          href="/profil"
          aria-label="Hesabım"
          className="flex flex-col items-center justify-center h-full pb-2 gap-1"
        >
          {isActivePath(pathname, '/profil') ? (
            <UserSolid className="w-6 h-6 text-[var(--color-primary)]" />
          ) : (
            <UserOutline className="w-6 h-6 text-gray-400" />
          )}
          <span
            className={`text-[10px] font-medium ${
              isActivePath(pathname, '/profil') ? 'text-[var(--color-primary)]' : 'text-gray-400'
            }`}
          >
            Hesabım
          </span>
        </Link>
      </div>
    </nav>
  );
}
