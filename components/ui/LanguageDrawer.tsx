'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

type Lang = 'tr' | 'en' | 'ru' | 'ar';

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
    document.documentElement.dir = LANGS[lang].dir;
  } catch {
    // ignore
  }
}

export function LanguageDrawer({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState<Lang>('tr');

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'tr' || stored === 'en' || stored === 'ru' || stored === 'ar') {
        setCurrentLang(stored);
        applyHtmlLang(stored);
      } else {
        applyHtmlLang('tr');
      }
    } catch {
      applyHtmlLang('tr');
    }
  }, []);

  const setLang = (lang: Lang) => {
    setCurrentLang(lang);
    applyHtmlLang(lang);

    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }

    // Mock hook point (wire real i18n later)
    // eslint-disable-next-line no-console
    console.info('[LanguageDrawer] Language changed:', lang);

    // Close quickly for "native" feel
    setOpen(false);
  };

  return (
    <div className={cx('w-full', className)} data-testid="language-drawer">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {/* Single trigger button (replaces segmented) */}
          <button
            type="button"
            className={cx(
              'w-full h-11 rounded-xl px-3',
              'inline-flex items-center justify-between gap-3',
              'bg-[color:var(--color-bg-secondary)] hover:bg-[color:var(--color-bg-secondary)]',
              'text-[color:var(--color-text-primary)]',
              'ring-1 ring-[color:var(--color-border)]',
              'transition-colors duration-200 motion-reduce:transition-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg-primary)]'
            )}
            aria-label="Dil seç"
          >
            <span className="text-sm font-semibold">Dil</span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="text-base leading-none">
                {LANGS[currentLang].flag}
              </span>
              <span className="text-sm font-semibold">{LANGS[currentLang].code}</span>
              <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
            </span>
          </button>
        </DrawerTrigger>

        {/* Bottom sheet */}
        <DrawerContent
          shouldScaleBackground
          className={cx(
            // keep it light + smooth
            'border border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)]',
            'rounded-t-2xl'
          )}
        >
          <div className="mx-auto w-full max-w-sm px-4 pb-2">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-[color:var(--color-text-primary)]">Dil Seç</DrawerTitle>
              <DrawerDescription className="text-[color:var(--color-text-secondary)]">
                Başparmakla hızlı seçim için aşağıdan seç.
              </DrawerDescription>
            </DrawerHeader>

            {/* 2x2 grid, big tap targets */}
            <div className="grid grid-cols-2 gap-3 pb-3">
              {(Object.keys(LANGS) as Lang[]).map((lang) => {
                const active = currentLang === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLang(lang)}
                    className={cx(
                      'h-14 rounded-xl px-4',
                      'inline-flex items-center justify-between gap-3',
                      'ring-1 ring-[color:var(--color-border)]',
                      'transition-colors duration-200 motion-reduce:transition-none',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg-primary)]',
                      active
                        ? 'bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)]'
                        : 'bg-[color:var(--color-bg-primary)] text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-bg-secondary)]'
                    )}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span aria-hidden className="text-xl leading-none">
                        {LANGS[lang].flag}
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold">{LANGS[lang].code}</span>
                        <span className="text-xs text-[color:var(--color-text-secondary)]">{LANGS[lang].label}</span>
                      </span>
                    </span>

                    {active ? <Check className="h-4 w-4 text-[color:var(--color-primary)]" aria-hidden /> : <span className="h-4 w-4" aria-hidden />}
                  </button>
                );
              })}
            </div>

            <DrawerFooter className="px-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Kapat
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

