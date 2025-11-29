'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function IlanVerPage() {
  // Satılık tekne formu route'unu kontrol et
  const hasListingForm = false; // V2'de true olacak

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

      {hasListingForm ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 p-8 text-center space-y-4">
          <p className="text-[var(--color-text-primary)]">
            Yeni bir tekne ilanı oluşturmak için aşağıdaki butona tıklayın
          </p>
          <Link href="/ilan-ver/satilik-tekne">
            <Button variant="primary" size="md">
              Tekne İlanı Oluştur
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-8 text-center space-y-4">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Çok yakında
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Satılık tekne ilanını buradan yayınlayabileceksin.
          </p>
        </div>
      )}
    </section>
  );
}

