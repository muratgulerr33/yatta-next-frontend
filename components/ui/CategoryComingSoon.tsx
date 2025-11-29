// components/ui/CategoryComingSoon.tsx
import React from "react";
import Link from "next/link";

export interface CategoryComingSoonProps {
  categoryTitle: string; // Örn: "TURLAR"
  title: string;         // H1
  description: string;   // kısa açıklama
  highlights: string[];  // bullet list
  roadmapNote?: string;  // opsiyonel roadmap satırı
}

export function CategoryComingSoon({
  categoryTitle,
  title,
  description,
  highlights,
  roadmapNote,
}: CategoryComingSoonProps) {
  return (
    <section className="page-shell py-12 md:py-20 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* Header / Hero */}
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-primary)] text-xs font-bold tracking-wider uppercase">
            {categoryTitle}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
            {title}
          </h1>

          <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* Highlights Card */}
        <div className="w-full bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">
            Bu kategoride neler olacak?
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {highlights.map((item, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary)] text-sm">
                  ✓
                </span>
                <span className="text-[var(--color-text-secondary)] font-medium">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {roadmapNote && (
            <div className="mt-6 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
              🚀 <span className="font-semibold">Roadmap:</span> {roadmapNote}
            </div>
          )}
        </div>

        {/* CTA Group */}
        <div className="w-full max-w-md space-y-4 pt-4">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Hazırlıklarımız sürerken bize hemen ulaşabilirsiniz:
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <a
              href="tel:+905304872333"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <span>📞</span>
              <span>Bizi Ara</span>
            </a>

            <a
              href="https://wa.me/905304872333"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-4"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

