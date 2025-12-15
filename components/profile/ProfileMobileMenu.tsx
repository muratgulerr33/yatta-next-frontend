'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  CalendarClock,
  ListChecks,
  Heart,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react';

type MenuSection = {
  title: string;
  items: {
    key: string;
    label: string;
    href: string;
    icon: typeof CalendarClock;
  }[];
};

const menuSections: MenuSection[] = [
  {
    title: 'Aktivite / İlanlar',
    items: [
      {
        key: 'rezervasyonlar',
        label: 'Rezervasyonlar',
        href: '/profil/rezervasyonlar',
        icon: CalendarClock,
      },
      {
        key: 'ilanlar',
        label: 'İlanlar',
        href: '/profil/ilanlar',
        icon: ListChecks,
      },
      {
        key: 'favoriler',
        label: 'Favoriler',
        href: '/profil/favoriler',
        icon: Heart,
      },
    ],
  },
  {
    title: 'Hesap / Ayarlar',
    items: [
      {
        key: 'ayarlar',
        label: 'Ayarlar',
        href: '/profil/ayarlar',
        icon: Settings,
      },
    ],
  },
];

export function ProfileMobileMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href === '/profil') {
      return pathname === '/profil';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="md:hidden space-y-4 mb-6">
      {menuSections.map((section) => (
        <div
          key={section.title}
          className="bg-white border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden"
        >
          {section.items.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isLast = index === section.items.length - 1;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3
                  transition-colors
                  ${!isLast ? 'border-b border-[var(--color-border)]' : ''}
                  ${active 
                    ? 'text-[var(--color-primary)] bg-[var(--color-bg-secondary)]/40' 
                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]/60'
                  }
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-[var(--color-text-secondary)]" />
              </Link>
            );
          })}
        </div>
      ))}

      {/* Çıkış Butonu */}
      <div className="bg-white border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]/60 transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0 text-red-600" />
          <span className="flex-1 text-sm font-medium text-left">Çıkış Yap</span>
          <ChevronRight className="h-4 w-4 text-[var(--color-text-secondary)]" />
        </button>
      </div>
    </div>
  );
}

