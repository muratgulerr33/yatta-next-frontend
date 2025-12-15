'use client';

// /home/yatta/apps/frontend/app/profil/page.tsx  (veya page.jsx)
// Mobile-first: Vertical Settings List
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import {
  CalendarDaysIcon,
  RectangleStackIcon,
  HeartIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '@/contexts/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';

function GroupCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-500 px-1 mb-2">{title}</p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function RowLink({
  href,
  icon: Icon,
  label,
  danger,
}: {
  href: string;
  icon: any;
  label: string;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex items-center justify-between min-h-[56px] px-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${danger ? 'text-red-500' : 'text-gray-500'}`} />
        <span className={`text-[15px] font-medium ${danger ? 'text-red-600' : 'text-gray-900'}`}>{label}</span>
      </div>
      <ChevronRightIcon className="h-5 w-5 text-gray-300" />
    </Link>
  );
}

export default function ProfilHomePage() {
  useRequireAuth();
  const { logout } = useAuth();

  return (
    <div className="bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-none">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Profil</h1>

      {/* Mobile Settings List (native-like) */}
      <div className="md:hidden py-6 space-y-4">
        <GroupCard title="AKTİVİTE">
          <RowLink href="/profil/rezervasyonlar" icon={CalendarDaysIcon} label="Rezervasyonlarım" />
          <RowLink href="/profil/ilanlar" icon={RectangleStackIcon} label="İlanlarım" />
          <RowLink href="/profil/favoriler" icon={HeartIcon} label="Favorilerim" />
        </GroupCard>

        <GroupCard title="HESAP">
          <RowLink href="/profil/hesabim" icon={Cog6ToothIcon} label="Hesap Ayarları" />
          <RowLink href="/profil/odemeler" icon={CreditCardIcon} label="Ödeme Yöntemleri" />
        </GroupCard>

        <GroupCard title="DİĞER">
          <RowLink href="/destek-iletisim" icon={QuestionMarkCircleIcon} label="Yardım" />
          <button
            type="button"
            aria-label="Çıkış Yap"
            onClick={logout}
            className="w-full flex items-center justify-between min-h-[56px] px-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
              <span className="text-[15px] font-medium text-red-600">Çıkış Yap</span>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-300" />
          </button>
        </GroupCard>
      </div>

      {/* Desktop: mevcut tab'lar üstte (ProfilTabs) zaten çalışıyor; burada basit yönlendirme bırakıyoruz */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-900 font-semibold mb-1">Profil Paneli</p>
          <p className="text-gray-600 text-sm">
            Üstteki sekmelerden Rezervasyonlar, İlanlar, Mesajlar ve Hesap ayarlarına geçebilirsin.
          </p>
        </div>
      </div>
    </div>
  );
}
