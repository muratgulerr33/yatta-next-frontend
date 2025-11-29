'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMyListings, type ListingDetail } from '@/lib/api';
import SaleBoatCard, { type SaleBoatCardProps } from '@/components/listing/SaleBoatCard';
import { getMediaUrl } from '@/lib/media';

export default function IlanlarimPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<ListingDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent('/profil/ilanlarim')}`);
      return;
    }

    loadListings();
  }, [isAuthenticated, authLoading, router]);

  const loadListings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchMyListings();
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İlanlar yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const mapListingToCardProps = (listing: ListingDetail): SaleBoatCardProps => {
    const coverImage = listing.media.find((m) => m.is_cover) || listing.media[0];
    const imageUrl = coverImage ? getMediaUrl(coverImage.image) : '/satilik-tekneler.webp';
    
    const location = [listing.location_province, listing.location_district]
      .filter(Boolean)
      .join(', ') || 'Konum belirtilmemiş';

    const price = typeof listing.price === 'string' ? parseFloat(listing.price) : listing.price || 0;
    const length = typeof listing.length_m === 'string' ? parseFloat(listing.length_m) : listing.length_m || 0;

    return {
      id: String(listing.id),
      slug: listing.slug,
      title: listing.title,
      price,
      currency: (listing.currency as 'TRY' | 'EUR' | 'USD') || 'TRY',
      location,
      specs: {
        length,
        year: listing.year_built || 0,
        cabins: listing.cabin_count || 0,
      },
      images: listing.media.length > 0 
        ? listing.media.map((m) => getMediaUrl(m.image))
        : [imageUrl],
      isFavorite: false,
    };
  };

  if (authLoading || isLoading) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            İlanlarım
          </h1>
        </header>
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          Yükleniyor...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            İlanlarım
          </h1>
        </header>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>
          <button
            onClick={loadListings}
            className="mt-4 text-sm text-red-600 hover:underline"
          >
            Tekrar Dene
          </button>
        </div>
      </section>
    );
  }

  const hasListings = listings.length > 0;

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          İlanlarım
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Satılık, kiralık ve diğer tüm ilanlarını buradan yöneteceksin.
        </p>
      </header>

      {hasListings ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
            const cardProps = mapListingToCardProps(listing);
            return (
              <div key={listing.id} className="relative">
                <SaleBoatCard data={cardProps} />
                <div className="mt-2 flex gap-2">
                  <Link
                    href={`/ilan/${listing.slug}`}
                    className="text-sm text-[var(--color-primary)] hover:underline"
                  >
                    Detay
                  </Link>
                  <span className="text-sm text-[var(--color-text-secondary)]">•</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {listing.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-6 text-center">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Henüz bir ilanın yok.
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Satılık tekne, kiralık yat veya diğer ürünlerin için ilk ilanını
            YATTA üzerinden oluşturduğunda burada göreceksin.
          </p>
        </div>
      )}
    </section>
  );
}

