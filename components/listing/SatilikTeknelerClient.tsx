"use client";

import { useState, useEffect, useCallback } from "react";
import { type ListingSummary, ApiError } from "@/lib/api";
import { getFavorites, type Favorite } from "@/lib/api/favorites";
import { getMediaUrl } from "@/lib/media";
import { useAuth } from "@/contexts/AuthContext";
import SaleBoatCard, {
  SaleBoatCardProps,
} from "@/components/listing/SaleBoatCard";

interface SatilikTeknelerClientProps {
  listings: ListingSummary[];
}

function mapListingToCardProps(
  listing: ListingSummary,
  favoriteId: number | null
): SaleBoatCardProps {
  // Media array'ini kontrol et ve görselleri işle
  let images: string[] = [];

  if (listing.media && Array.isArray(listing.media) && listing.media.length > 0) {
    // Media'yı sırala: is_cover önce, sonra order'a göre
    const sortedMedia = [...listing.media].sort((a, b) => {
      if (a.is_cover) return -1;
      if (b.is_cover) return 1;
      return (a.order ?? 0) - (b.order ?? 0);
    });

    // Tüm media görsellerini getMediaUrl ile işle
    images = sortedMedia.map((media) => getMediaUrl(media.image));
  } else if (listing.cover_image_url) {
    // Fallback: cover_image_url kullan
    images = [getMediaUrl(listing.cover_image_url)];
  } else {
    // Son fallback: placeholder
    images = ["/placeholder-boat.jpg"];
  }

  const location = [listing.city_display, listing.district_display]
    .filter(Boolean)
    .join(", ") || "Konum belirtilmedi";

  const price =
    typeof listing.price === "string"
      ? parseFloat(listing.price)
      : listing.price || 0;

  const length = listing.length_overall || 0;

  return {
    id: String(listing.id),
    slug: listing.slug,
    title: listing.title,
    price,
    currency: (listing.currency as "TRY" | "EUR" | "USD") || "TRY",
    location,
    specs: {
      length,
      year: listing.year_built ?? 0,
      cabins: listing.cabins ?? 0,
    },
    images,
    isFavorite: favoriteId !== null,
    favoriteId: favoriteId ?? undefined,
  };
}

export default function SatilikTeknelerClient({
  listings,
}: SatilikTeknelerClientProps) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoritesMap, setFavoritesMap] = useState<Map<number, number>>(
    new Map()
  ); // listingId -> favoriteId
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // Favorileri yükleme fonksiyonu
  const loadFavorites = useCallback(async () => {
    setIsLoadingFavorites(true);

    try {
      // getFavorites() artık paginated response'u handle ediyor
      const favoritesArray = await getFavorites();

      // Listing ID -> Favorite ID mapping oluştur
      const map = new Map<number, number>();
      favoritesArray.forEach((fav) => {
        map.set(fav.listing.id, fav.id);
      });
      setFavoritesMap(map);
      setFavorites(favoritesArray);
    } catch (err) {
      // ÖNEMLİ: 401 Unauthorized durumunu sessizce yut
      if (err instanceof ApiError && err.status === 401) {
        console.info("[favorites] Guest kullanıcı, 401 geldi -> favori listesi boş olarak ayarlandı");
        setFavorites([]);
        setFavoritesMap(new Map());
      } else {
        console.error("[favorites] loadFavorites hata", err);
      }
    } finally {
      setIsLoadingFavorites(false);
    }
  }, []);

  // Sayfa yüklendiğinde favorileri çek
  useEffect(() => {
    if (!isAuthenticated) {
      // Guest kullanıcı ise favori çağrısı yapma, state'i boş bırak
      setFavorites([]);
      setFavoritesMap(new Map());
      setIsLoadingFavorites(false);
      return;
    }

    let isMounted = true;

    async function load() {
      await loadFavorites();
      if (!isMounted) return;
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, loadFavorites]);

  // Favori durumu değiştiğinde global state'i güncelle
  const handleFavoriteChange = (
    listingId: number,
    isFavorite: boolean,
    favoriteId: number | null
  ) => {
    if (isFavorite && favoriteId !== null) {
      // Favori eklendi
      setFavorites((prev) => {
        // Eğer zaten listede varsa güncelle, yoksa ekle
        const existing = prev.find((f) => f.listing.id === listingId);
        if (existing) {
          return prev.map((f) =>
            f.listing.id === listingId ? { ...f, id: favoriteId } : f
          );
        }
        // Yeni favori eklemek için listing bilgisine ihtiyacımız var
        // Bu durumda getFavorites() çağırmak yerine, mevcut listings'ten bulabiliriz
        const listing = listings.find((l) => l.id === listingId);
        if (listing) {
          return [
            ...prev,
            {
              id: favoriteId,
              listing: listing,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ];
        }
        return prev;
      });

      setFavoritesMap((prev) => {
        const next = new Map(prev);
        next.set(listingId, favoriteId);
        return next;
      });
    } else {
      // Favori çıkarıldı
      setFavorites((prev) => prev.filter((f) => f.listing.id !== listingId));
      setFavoritesMap((prev) => {
        const next = new Map(prev);
        next.delete(listingId);
        return next;
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing, index) => {
        const favoriteId = favoritesMap.get(listing.id) ?? null;
        const cardProps = mapListingToCardProps(listing, favoriteId);
        return (
          <SaleBoatCard
            key={listing.id}
            data={{
              ...cardProps,
              position: index,
              onFavoriteChange: handleFavoriteChange,
            }}
          />
        );
      })}
    </div>
  );
}
