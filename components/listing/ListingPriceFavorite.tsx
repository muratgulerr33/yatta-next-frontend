'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { addFavorite, removeFavorite, getFavorites } from '@/lib/api/favorites';
import { Heart } from 'lucide-react';
import type { ListingDetail } from '@/lib/api';

interface ListingPriceFavoriteProps {
  listing: ListingDetail;
}

export default function ListingPriceFavorite({ listing }: ListingPriceFavoriteProps) {
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

  const handleToggleFavorite = async () => {
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

  const formattedPrice = listing.price_on_request
    ? "Fiyat için iletişim"
    : formatPrice(listing.price, listing.currency);

  return (
    <div className="mt-2 mb-4 flex w-full items-center justify-between">
      <p className="text-2xl font-bold tracking-tight text-[#002b5b]">
        {formattedPrice}
      </p>

      <button
        type="button"
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className="rounded-full bg-transparent p-2 transition-transform duration-200 active:scale-90"
        aria-label={isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"}
      >
        <Heart
          className={`h-6 w-6 ${
            isFavorite ? "text-red-500 fill-red-500" : "text-gray-400 fill-transparent"
          }`}
        />
      </button>
    </div>
  );
}
