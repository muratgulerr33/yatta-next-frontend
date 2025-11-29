const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yatta.com.tr';

export interface Favorite {
  id: number;
  listing: {
    id: number;
    title: string;
    slug: string;
    price: string | number;
    currency: string;
    location_province: string | null;
    location_district: string | null;
    length_m: string | number | null;
    year_built: number | null;
    cabin_count: number | null;
    media: Array<{
      id: number;
      image: string;
      is_cover: boolean;
      order: number;
    }>;
  };
  created_at: string;
  updated_at: string;
}

export interface FavoriteResponse {
  id: number;
  listing: Favorite['listing'];
  created_at: string;
  updated_at: string;
}

/**
 * Kullanıcının favorilerini getir
 */
export async function fetchFavorites(): Promise<Favorite[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/favorites/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Giriş yapmanız gerekiyor');
      }
      throw new Error(`Favoriler yüklenemedi: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch favorites error:', error);
    throw error;
  }
}

/**
 * Favori ekle
 */
export async function addFavorite(listingId: number): Promise<FavoriteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/favorites/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ listing_id: listingId }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Giriş yapmanız gerekiyor');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Favori eklenemedi: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Add favorite error:', error);
    throw error;
  }
}

/**
 * Favori kaldır
 */
export async function removeFavorite(favoriteId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/favorites/${favoriteId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Giriş yapmanız gerekiyor');
      }
      if (response.status === 404) {
        throw new Error('Favori bulunamadı');
      }
      throw new Error(`Favori kaldırılamadı: ${response.status}`);
    }
  } catch (error) {
    console.error('Remove favorite error:', error);
    throw error;
  }
}

