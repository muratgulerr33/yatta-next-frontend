import { fetchSaleListings, type ListingSummary } from "@/lib/api";
import SatilikTeknelerClient from "@/components/listing/SatilikTeknelerClient";
import FilterBarV1 from "@/components/listing/FilterBarV1";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/satilik-tekneler" },
};

// Force dynamic rendering to ensure searchParams changes trigger re-render
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ALLOWED_FILTER_PARAMS = [
  'search',
  'location_province',
  'boat_type',
  'price_min',
  'price_max',
  'length_min',
  'length_max',
  'year_min',
  'year_max',
];

export default async function SatilikTeknelerPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Next.js 15: searchParams is now a Promise
  const resolvedSearchParams = await (searchParams ?? Promise.resolve({}));
  
  // Build query string from allowed searchParams
  const queryString = resolvedSearchParams && Object.keys(resolvedSearchParams).length > 0
    ? Object.entries(resolvedSearchParams)
        .filter(([key]) => ALLOWED_FILTER_PARAMS.includes(key))
        .map(([key, value]) => ({
          key,
          value: Array.isArray(value) ? value[0] : value,
        }))
        .filter(({ value }) => typeof value === 'string' && value.trim() !== '')
        .map(({ key, value }) => `${key}=${encodeURIComponent(value as string)}`)
        .join('&')
    : undefined;

  let listings: ListingSummary[] = [];
  let error: string | null = null;

  try {
    listings = await fetchSaleListings(queryString);
  } catch (err) {
    error = err instanceof Error ? err.message : 'İlanlar yüklenemedi';
  }

  return (
    <>
      <Suspense fallback={<div className="sticky top-14 lg:top-16 z-30 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm h-16" />}>
        <FilterBarV1 />
      </Suspense>

      <div className="min-h-screen bg-[var(--color-bg-primary)] py-10">
        <div className="page-shell px-4 py-6 sm:px-6 lg:px-8 space-y-6">
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
    </>
  );
}
