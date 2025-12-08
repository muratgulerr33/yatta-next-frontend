'use client';

import { useEffect, useState, useCallback } from "react";
import { getFavorites, type Favorite } from "@/lib/api/favorites";
import { getMediaUrl } from "@/lib/media";
import { useAuth } from "@/contexts/AuthContext";
import SaleBoatCard, {
  SaleBoatCardProps,
} from "@/components/listing/SaleBoatCard";
import { type ListingSummary } from "@/lib/api";

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

export default function FavorilerPage() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoritesMap, setFavoritesMap] = useState<Map<number, number>>(
    new Map()
  ); // listingId -> favoriteId
  const [loading, setLoading] = useState(true);

  // Favori durumu değiştiğinde state'i güncelle
  const handleFavoriteChange = useCallback((
    listingId: number,
    isFavorite: boolean,
    favoriteId: number | null
  ) => {
    if (isFavorite && favoriteId !== null) {
      // Favori eklendi (bu sayfada olmaz ama callback'i hazır tut)
      setFavoritesMap((prev) => {
        const next = new Map(prev);
        next.set(listingId, favoriteId);
        return next;
      });
    } else {
      // Favori çıkarıldı - listeden kaldır
      setFavorites((prev) => prev.filter((f) => f.listing.id !== listingId));
      setFavoritesMap((prev) => {
        const next = new Map(prev);
        next.delete(listingId);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      // Guest kullanıcı ise favori çağrısı yapma, state'i boş bırak
      setFavorites([]);
      setFavoritesMap(new Map());
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        const data = await getFavorites();
        if (mounted) {
          setFavorites(data);
          // Listing ID -> Favorite ID mapping oluştur
          const map = new Map<number, number>();
          data.forEach((fav) => {
            map.set(fav.listing.id, fav.id);
          });
          setFavoritesMap(map);
        }
      } catch (error) {
        // TODO: toast eklenebilir, şimdilik sessiz geçebilir
        console.error("Favoriler yüklenirken hata:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  if (loading) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Favorilerim
          </h1>
        </header>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-6 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Favoriler yükleniyor...
          </p>
        </div>
      </section>
    );
  }

  if (!favorites.length) {
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

        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-6 text-center">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Henüz favori eklemedin.
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            İlan kartlarındaki kalp ikonuna tıklayarak favori listeni
            oluşturabilirsin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Favorilerim
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {favorites.length} favori ilan
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((fav) => {
          const listing = fav.listing;
          // favoritesMap'ten favoriteId'yi al, yoksa fav.id kullan (favorites array'inden geldiği için her zaman var)
          const favoriteId = favoritesMap.get(listing.id) ?? fav.id;
          const cardProps = mapListingToCardProps(listing, favoriteId);
          
          return (
            <SaleBoatCard
              key={fav.id}
              data={{
                ...cardProps,
                onFavoriteChange: handleFavoriteChange,
              }}
            />
          );
        })}
      </div>
    </section>
  );
}

