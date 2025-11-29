'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHelinChatContext } from '@/contexts/HelinChatContext';

type Tab = {
  label: string;
  show: boolean;
  type: 'link' | 'action';
  href?: string;
  onClick?: () => void;
};

interface ProfilTabsProps {
  inSeller: boolean;
}

export function ProfilTabs({ inSeller }: ProfilTabsProps) {
  const pathname = usePathname();
  const { toggleChat } = useHelinChatContext();

  const tabs: Tab[] = [
    {
      href: '/profil/rezervasyonlar',
      label: 'Rezervasyonlarım',
      show: true,
      type: 'link' as const,
    },
    {
      href: '/profil/ilanlar',
      label: 'Tekne İlanlarım',
      show: inSeller,
      type: 'link' as const,
    },
    {
      href: '/profil/ilan-ver',
      label: 'İlan ver',
      show: inSeller,
      type: 'link' as const,
    },
    {
      href: '/profil/hesabim',
      label: 'Hesabım',
      show: true,
      type: 'link' as const,
    },
    {
      label: 'Asistana sor',
      show: true,
      onClick: toggleChat,
      type: 'action' as const,
    },
  ].filter((tab) => tab.show);

  return (
    <nav className="sticky top-0 z-10 bg-[var(--color-bg-primary)] border-b border-slate-200 mb-6" aria-label="Profil sekmeleri">
      <div className="flex overflow-x-auto scrollbar-hide -mb-px snap-x snap-mandatory">
        {tabs.map((tab, index) => {
          const isActive = tab.type === 'link' && tab.href ? pathname === tab.href : false;

          if (tab.type === 'action') {
            return (
              <button
                key={index}
                onClick={tab.onClick}
                className={`
                  px-4 py-3 text-sm font-medium whitespace-nowrap
                  border-b-2 border-transparent
                  text-slate-600 hover:text-[#004aad] hover:border-slate-300
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:ring-offset-2
                `}
              >
                {tab.label}
              </button>
            );
          }

          return (
            <Link
              key={index}
              href={tab.href!}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors
                focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:ring-offset-2
                ${
                  isActive
                    ? 'border-[#004aad] text-[#004aad]'
                    : 'border-transparent text-slate-600 hover:text-[#004aad] hover:border-slate-300'
                }
              `}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

