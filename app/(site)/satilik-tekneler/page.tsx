import { fetchSaleListings, type ListingSummary } from "@/lib/api";
import SatilikTeknelerClient from "@/components/listing/SatilikTeknelerClient";

export default async function SatilikTeknelerPage() {
  let listings: ListingSummary[] = [];
  let error: string | null = null;

  try {
    listings = await fetchSaleListings();
  } catch (err) {
    error = err instanceof Error ? err.message : 'İlanlar yüklenemedi';
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-10">
      <div className="page-shell space-y-6">
        <header className="space-y-1">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Kategori · Satılık tekneler
          </p>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Satılık Tekne & Yat İlanları
          </h1>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        ) : listings.length > 0 ? (
          <SatilikTeknelerClient listings={listings} />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-8 text-center">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              Bu kategoride henüz ilan yok.
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              İlk ilanı sen verebilirsin ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
