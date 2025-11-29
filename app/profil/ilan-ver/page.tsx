'use client';

import { ListingWizard } from '@/components/listing/ListingWizard';

export default function IlanVerPage() {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          İlan Ver
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Satılık tekne, kiralık yat veya diğer ürünlerin için ilan oluştur.
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 p-6">
        <ListingWizard />
      </div>
    </section>
  );
}

