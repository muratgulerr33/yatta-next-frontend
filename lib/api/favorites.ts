// lib/api/favorites.ts
import { request, ApiError, type ListingSummary } from "../api";

export interface Favorite {
  id: number;
  listing: ListingSummary;
  created_at: string;
  updated_at: string;
}

const FAVORITES_BASE = "/api/v1/favorites/";

export async function getFavorites(): Promise<Favorite[]> {
  const data = await request<any>(FAVORITES_BASE, {
    method: "GET",
  });
  // Paginated response handling: hem düz array, hem { results: [] } için güvenli şekilde favori array'ini çıkar
  const favoritesArray = Array.isArray(data) ? data : data?.results ?? [];
  return favoritesArray;
}

export async function addFavorite(listingId: number): Promise<Favorite> {
  try {
    const favorite = await request<Favorite>(FAVORITES_BASE, {
      method: "POST",
      // Backend FavoriteSerializer listing_id write-only field bekliyor
      body: JSON.stringify({ listing_id: listingId }),
    });
    return favorite;
  } catch (err) {
    if (err instanceof ApiError && err.status === 400 && err.data) {
      // Backend "Bu ilan zaten favorilerinizde." validation error'u
      try {
        const data = err.data as any;
        const messages =
          (data.listing as string[]) ??
          (Array.isArray(data) ? data : null);

        const alreadyFav =
          Array.isArray(messages) &&
          messages.some((m) =>
            String(m).includes("Bu ilan zaten favorilerinizde")
          );

        if (alreadyFav) {
          // İlan zaten favorilerde → mevcut favoriyi bul ve onu dön
          const favorites = await getFavorites();
          const existing = favorites.find(
            (fav) => fav.listing.id === listingId
          );
          if (existing) {
            return existing;
          }
        }
      } catch {
        // parse hatası durumunda normal hata flow'una düşsün
      }
    }

    // Diğer tüm durumlarda hatayı aynen fırlat
    throw err;
  }
}

export async function removeFavorite(favoriteId: number): Promise<void> {
  await request<void>(`${FAVORITES_BASE}${favoriteId}/`, {
    method: "DELETE",
  });
}

