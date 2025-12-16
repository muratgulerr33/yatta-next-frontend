'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';

export type Lang = 'tr' | 'en' | 'ru' | 'ar';

const STORAGE_KEY = 'yatta:lang';

const LANGS: Record<
  Lang,
  { code: string; label: string; flag: string; htmlLang: string; dir: 'ltr' | 'rtl' }
> = {
  tr: { code: 'TR', label: 'Türkçe', flag: '🇹🇷', htmlLang: 'tr', dir: 'ltr' },
  en: { code: 'EN', label: 'English', flag: '🇬🇧', htmlLang: 'en', dir: 'ltr' },
  ru: { code: 'RU', label: 'Русский', flag: '🇷🇺', htmlLang: 'ru', dir: 'ltr' },
  ar: { code: 'AR', label: 'العربية', flag: '🇸🇦', htmlLang: 'ar', dir: 'rtl' },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function applyHtmlLang(lang: Lang) {
  try {
    document.documentElement.lang = LANGS[lang].htmlLang;
    document.documentElement.dir = LANGS[lang].dir; // Arabic => rtl
  } catch {
    // ignore
  }
}

export function LanguageSwitcher({
  className,
  initialLang = 'tr',
  persist = true,
  onChange,
}: {
  className?: string;
  initialLang?: Lang;
  persist?: boolean;
  onChange?: (lang: Lang) => void;
}) {
  const [currentLang, setCurrentLang] = React.useState<Lang>(initialLang);
  const [isOpen, setIsOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!persist) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'tr' || stored === 'en' || stored === 'ru' || stored === 'ar') {
        setCurrentLang(stored);
        applyHtmlLang(stored);
      } else {
        applyHtmlLang(initialLang);
      }
    } catch {
      applyHtmlLang(initialLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persist]);

  React.useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setIsOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const setLang = (lang: Lang) => {
    setCurrentLang(lang);
    setIsOpen(false);

    applyHtmlLang(lang);

    if (persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // ignore
      }
    }

    // Mock hook point (wire real i18n later)
    // eslint-disable-next-line no-console
    console.info('[LanguageSwitcher] Language changed:', lang);

    onChange?.(lang);
  };

  return (
    <div ref={rootRef} className={cx('relative inline-flex', className)} data-testid="language-switcher-header">
      {/* Trigger: TEXT ONLY (NO FLAG) */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={cx(
          'h-11 rounded-lg px-3 text-sm font-semibold tracking-wide',
          'inline-flex items-center gap-1.5',
          'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]',
          'hover:bg-[color:var(--color-bg-secondary)]',
          'transition-colors duration-200 motion-reduce:transition-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg-primary)]'
        )}
      >
        <span>{LANGS[currentLang].code}</span>
        <ChevronDown
          className={cx('h-4 w-4 transition-transform duration-200 motion-reduce:transition-none', isOpen && 'rotate-180')}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Language"
          className={cx(
            'absolute left-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl',
            'border border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)] shadow-xl'
          )}
        >
          <div className="py-1">
            {(Object.keys(LANGS) as Lang[]).map((lang) => {
              const active = currentLang === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  role="menuitem"
                  onClick={() => setLang(lang)}
                  className={cx(
                    'w-full px-3 py-2 text-left text-sm transition-colors duration-200 motion-reduce:transition-none',
                    'inline-flex items-center justify-between gap-3',
                    active
                      ? 'bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)]'
                      : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-text-primary)]'
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {/* Dropdown can show flags */}
                    <span aria-hidden className="text-base leading-none">
                      {LANGS[lang].flag}
                    </span>
                    <span className={cx(active && 'font-semibold')}>{LANGS[lang].label}</span>
                  </span>

                  {active ? <Check className="h-4 w-4 text-[color:var(--color-primary)]" aria-hidden /> : <span className="h-4 w-4" aria-hidden />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
