'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { addFavorite, removeFavorite, fetchFavorites } from '@/lib/api/favorites';
import { Heart } from 'lucide-react';
import type { ListingDetail } from '@/lib/api';

interface MobileStickyActionBarProps {
  listing: ListingDetail;
}

export default function MobileStickyActionBar({ listing }: MobileStickyActionBarProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, listing.id]);

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await fetchFavorites();
      const favorite = favorites.find((fav) => fav.listing.id === listing.id);
      if (favorite) {
        setIsFavorite(true);
        setFavoriteId(favorite.id);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/ilan/${listing.slug}`)}`);
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite && favoriteId) {
        await removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const favorite = await addFavorite(listing.id);
        setIsFavorite(true);
        setFavoriteId(favorite.id);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'İşlem başarısız oldu');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number | string | null, currency: string | null) => {
    if (!price || !currency) return "Fiyat bilgisi yok";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: currency || "TRY",
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const displayPrice = listing.price_on_request
    ? "Fiyat için iletişim"
    : formatPrice(listing.price, listing.currency);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[color:var(--color-bg-secondary)] border-t border-[color:var(--color-border)] lg:hidden pb-safe">
      <div className="page-shell">
        <div className="flex items-center justify-between gap-3 py-3">
          {/* Sol: Fiyat */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[color:var(--color-text-secondary)]">
              Fiyat
            </div>
            <div className="text-lg font-bold text-[color:var(--color-text-primary)] truncate">
              {displayPrice}
            </div>
          </div>

          {/* Orta: Favori */}
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={`p-2 transition-colors ${
              isFavorite
                ? 'text-red-500 hover:text-red-600'
                : 'text-[color:var(--color-text-secondary)] hover:text-red-500'
            }`}
            aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Sağ: Primary CTA */}
          {listing.contact_phone ? (
            <a
              href={`tel:${listing.contact_phone}`}
              className="bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)] rounded-lg px-4 py-2 font-semibold text-sm whitespace-nowrap hover:bg-[color:var(--color-primary-hover)] transition-colors"
            >
              Ara / Mesaj
            </a>
          ) : (
            <button className="bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)] rounded-lg px-4 py-2 font-semibold text-sm whitespace-nowrap hover:bg-[color:var(--color-primary-hover)] transition-colors">
              Mesaj Gönder
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

