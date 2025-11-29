"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  ListChecks,
  CalendarClock,
  Heart,
  MessagesSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";

type ProfileNavKey =
  | "profil"
  | "ilanlarim"
  | "ilan-ver"
  | "rezervasyonlar"
  | "favoriler"
  | "mesajlar"
  | "ayarlar";

type ProfileNavItem = {
  key: ProfileNavKey;
  label: string;
  href: string;
  icon: LucideIcon;
};

const profileNavItems: ProfileNavItem[] = [
  { key: "profil", label: "Profil", href: "/profil", icon: User },
  {
    key: "ilanlarim",
    label: "İlanlarım",
    href: "/profil/ilanlarim",
    icon: ListChecks,
  },
  {
    key: "ilan-ver",
    label: "İlan Ver",
    href: "/profil/ilan-ver",
    icon: ListChecks,
  },
  {
    key: "rezervasyonlar",
    label: "Rezervasyonlarım",
    href: "/profil/rezervasyonlar",
    icon: CalendarClock,
  },
  {
    key: "favoriler",
    label: "Favoriler",
    href: "/profil/favoriler",
    icon: Heart,
  },
  {
    key: "mesajlar",
    label: "Mesajlar",
    href: "/profil/mesajlar",
    icon: MessagesSquare,
  },
  {
    key: "ayarlar",
    label: "Ayarlar",
    href: "/profil/ayarlar",
    icon: Settings,
  },
];

function ProfileSidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 shrink-0 gap-2">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-[var(--color-text-secondary)]">
          Hesabım
        </h2>
        <p className="text-lg font-semibold text-[var(--color-text-primary)]">
          Profil Paneli
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {profileNavItems.map((item) => {
          const isActive =
            item.href === "/profil"
              ? pathname === "/profil"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={[
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all",
                "border border-transparent",
                isActive
                  ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]/60",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function ProfileMobileTabs() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden sticky top-0 z-10 -mx-4 mb-4 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]">
      <div className="page-shell px-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 snap-x snap-mandatory">
          {profileNavItems.map((item) => {
            const isActive =
              item.href === "/profil"
                ? pathname === "/profil"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={[
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium border snap-start",
                  "transition-all min-w-fit",
                  isActive
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                    : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] py-8">
        <div className="page-shell">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-[var(--color-text-secondary)]">Yükleniyor...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect will happen
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-8">
      <div className="page-shell">
        <ProfileMobileTabs />
        <div className="grid gap-8 md:grid-cols-[240px,minmax(0,1fr)]">
          <ProfileSidebarNav />
          <main className="flex flex-col gap-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
