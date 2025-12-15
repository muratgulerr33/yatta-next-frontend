'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { addFavorite, removeFavorite, getFavorites } from '@/lib/api/favorites';
import { useListingMessageAction } from '@/hooks/useListingMessageAction';
import { Heart } from 'lucide-react';
import type { ListingDetail } from '@/lib/api';

interface ListingActionSidebarProps {
  listing: ListingDetail;
}

export default function ListingActionSidebar({ listing }: ListingActionSidebarProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleMessageClick } = useListingMessageAction(listing.owner_id);

  useEffect(() => {
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, listing.id]);

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await getFavorites();
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
        // Remove favorite
        await removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        // Add favorite
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
    ? "Fiyat bilgisi için iletişime geçin"
    : formatPrice(listing.price, listing.currency);

  return (
    <div className="space-y-6">
      {/* Fiyat Kartı */}
      <div className="bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border)] rounded-xl p-6 shadow-sm">
        <div className="space-y-4">
          <div className="text-xs uppercase text-[color:var(--color-text-secondary)]">
            Satış Fiyatı
          </div>
          <div className="text-3xl font-bold text-[color:var(--color-text-primary)]">
            {displayPrice}
          </div>

          {/* Primary CTA */}
          {listing.contact_phone && (
            <a
              href={`tel:${listing.contact_phone}`}
              className="block w-full bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)] rounded-lg px-4 py-3 font-semibold hover:bg-[color:var(--color-primary-hover)] transition-colors text-center"
            >
              Satıcıyı Ara
            </a>
          )}

          {/* Secondary CTA */}
          <button 
            onClick={handleMessageClick}
            className="w-full border border-[color:var(--color-border)] text-[color:var(--color-text-primary)] rounded-lg px-4 py-3 font-semibold hover:bg-[color:var(--color-bg-secondary)] transition-colors"
          >
            Mesaj Gönder
          </button>

          {/* Favori/Paylaş */}
          <div className="flex gap-2 pt-2 border-t border-[color:var(--color-border)]">
            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 text-sm transition-colors ${
                isFavorite
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-primary)]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Favorilerden Çıkar' : 'Favorile'}
            </button>
            <button className="flex-1 text-sm text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-primary)] transition-colors">
              📤 Paylaş
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

