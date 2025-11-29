'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SaleBoatCard, {
  type SaleBoatCardProps,
} from "@/components/listing/SaleBoatCard";
import { fetchFavorites, removeFavorite, type Favorite } from '@/lib/api/favorites';
import { getMediaUrl } from '@/lib/media';

export default function FavorilerPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent('/profil/favoriler')}`);
      return;
    }

    loadFavorites();
  }, [isAuthenticated, authLoading, router]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Favoriler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: number, listingId: number) => {
    try {
      // Optimistic update
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
      
      await removeFavorite(favoriteId);
    } catch (err) {
      // Rollback on error
      loadFavorites();
      alert(err instanceof Error ? err.message : 'Favori kaldırılamadı');
    }
  };

  const mapFavoriteToCardProps = (favorite: Favorite): SaleBoatCardProps => {
    const listing = favorite.listing;
    const coverImage = listing.media.find((m) => m.is_cover) || listing.media[0];
    const imageUrl = coverImage ? getMediaUrl(coverImage.image) : '/satilik-tekneler.webp';
    
    const location = [listing.location_province, listing.location_district]
      .filter(Boolean)
      .join(', ') || 'Konum belirtilmemiş';

    return {
      id: String(listing.id),
      slug: listing.slug,
      title: listing.title,
      price: typeof listing.price === 'string' ? parseFloat(listing.price) : listing.price || 0,
      currency: (listing.currency as 'TRY' | 'EUR' | 'USD') || 'TRY',
      location,
      specs: {
        length: typeof listing.length_m === 'string' ? parseFloat(listing.length_m) : listing.length_m || 0,
        year: listing.year_built || 0,
        cabins: listing.cabin_count || 0,
      },
      images: listing.media.length > 0 
        ? listing.media.map((m) => getMediaUrl(m.image))
        : [imageUrl],
      isFavorite: true,
      favoriteId: favorite.id,
      onRemoveFavorite: () => handleRemoveFavorite(favorite.id, listing.id),
    };
  };

  if (authLoading || isLoading) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Favorilerim
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
            Favorilerim
          </h1>
        </header>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>
          <button
            onClick={loadFavorites}
            className="mt-4 text-sm text-red-600 hover:underline"
          >
            Tekrar Dene
          </button>
        </div>
      </section>
    );
  }

  const hasFavorites = favorites.length > 0;

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Favorilerim
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Beğendiğin ilanlar ve ürünler burada listelenecek.
        </p>
      </header>

      {hasFavorites ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => {
            const cardProps = mapFavoriteToCardProps(favorite);
            return (
              <SaleBoatCard key={favorite.id} data={cardProps} />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-6 text-center">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Henüz favori eklemedin.
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            İlan kartlarındaki kalp ikonuna tıklayarak favori listeni
            oluşturabilirsin.
          </p>
        </div>
      )}
    </section>
  );
}

