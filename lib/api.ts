/**
 * API Client Helper - Next.js native fetch kullanır
 * SSR için optimize edilmiştir
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

/* -------------------------------------------------------
   ApiError Class
------------------------------------------------------- */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/* -------------------------------------------------------
   Request Helper
------------------------------------------------------- */
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
    ...init,
    credentials: init.credentials ?? "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  } catch (err: any) {
    // Ağ kesintilerini daha okunabilir bir hataya sar
    throw new ApiError(err?.message || "Network request failed", 0, null);
  }

  if (!res.ok) {
    let errorData: unknown = null;
    let errorMessage = `Request failed: ${res.status} ${res.statusText}`;

    try {
      errorData = await res.json();
      if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (
        errorData &&
        typeof errorData === "object" &&
        "detail" in (errorData as any)
      ) {
        errorMessage = (errorData as any).detail;
      } else {
        errorMessage = JSON.stringify(errorData);
      }
    } catch {
      // body parse edilemezse default mesajı kullan
    }

    throw new ApiError(errorMessage, res.status, errorData);
  }

  // 204 No Content veya 205 Reset Content durumlarında body yok
  if (res.status === 204 || res.status === 205) {
    return undefined as T;
  }

  // Content-Type kontrolü ile güvenli JSON parse
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return (await res.json()) as T;
  }

  // JSON değilse text olarak döndür (veya undefined)
  return undefined as T;
}

/* -------------------------------------------------------
   Interfaces & Types
------------------------------------------------------- */
export interface ListingMedia {
  id: number;
  image: string;
  position?: number;
  order?: number;
  is_cover?: boolean;
}

export interface ListingSummary {
  id: number;
  slug: string;
  title: string;
  price: number | string | null;
  currency: string | null;
  cover_image_url?: string | null;
  city_display?: string | null;
  district_display?: string | null;
  year_built?: number | null;
  length_overall?: number | null;
  cabins?: number | null;
  is_favorite?: boolean;
  media?: ListingMedia[];
}

export interface ListingDetail {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  price: number | string | null;
  currency: string | null;
  price_on_request?: boolean;
  location_province?: string | null;
  location_district?: string | null;
  city_display?: string | null;
  district_display?: string | null;
  year_built?: number | null;
  length_m?: number | string | null;
  length_overall?: number | null;
  beam_m?: number | string | null;
  cabin_count?: number | null;
  cabins?: number | null;
  capacity_people?: number | null;
  brand_name?: string | null;
  model_name?: string | null;
  engine_count?: number | null;
  fuel_type?: string | null;
  engine_info_note?: string | null;
  hull_type?: string | null;
  license_type?: string | null;
  country_of_registry?: string | null;
  status?: string;
  seller_type?: string;
  owner?: string;
  owner_id?: number;
  contact_phone?: string | null;
  media: ListingMedia[];
  is_favorite?: boolean;
}

export interface PartnerPublicProfile {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/* -------------------------------------------------------
   Fetch Sale Listings
------------------------------------------------------- */
export async function fetchSaleListings(queryString?: string): Promise<ListingSummary[]> {
  const url = `/api/v1/listings/?category_key=satilik-tekneler${queryString ? `&${queryString}` : ''}`;
  const data = await request<PaginatedResponse<any>>(url);

  return data.results.map((item) => {
    // cover_image_url için media array'inden is_cover olanı veya ilkini bul
    let cover_image_url: string | null = null;
    let media: ListingMedia[] | undefined = undefined;
    
    if (item.media && Array.isArray(item.media) && item.media.length > 0) {
      // Media array'ini ListingMedia formatına dönüştür
      media = item.media.map((m: any) => ({
        id: m.id || 0,
        image: m.image || '',
        position: m.position,
        order: m.order ?? m.position ?? 0,
        is_cover: m.is_cover || false,
      }));
      
      const coverMedia = media.find((m) => m.is_cover === true) || media[0];
      cover_image_url = coverMedia?.image || null;
    } else if (item.cover_image_url) {
      cover_image_url = item.cover_image_url;
    }

    // length_overall için length_m'den dönüşüm
    let length_overall: number | null = null;
    if (item.length_overall !== undefined && item.length_overall !== null) {
      length_overall = typeof item.length_overall === "string" 
        ? parseFloat(item.length_overall) 
        : item.length_overall;
    } else if (item.length_m !== undefined && item.length_m !== null) {
      length_overall = typeof item.length_m === "string" 
        ? parseFloat(item.length_m) 
        : item.length_m;
    }

    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      price: item.price,
      currency: item.currency,
      city_display: item.city_display || item.location_province || null,
      district_display: item.district_display || item.location_district || null,
      year_built: item.year_built || null,
      length_overall,
      cabins: item.cabins || item.cabin_count || null,
      cover_image_url,
      is_favorite: item.is_favorite || false,
      media,
    };
  });
}

/* -------------------------------------------------------
   Fetch Listing Detail
------------------------------------------------------- */
export async function fetchListingDetail(slug: string): Promise<ListingDetail> {
  return await request<ListingDetail>(`/api/v1/listings/${slug}/`);
}

export async function fetchListing(slug: string): Promise<ListingDetail> {
  return fetchListingDetail(slug);
}

/* -------------------------------------------------------
   Fetch My Listings
------------------------------------------------------- */
export async function fetchMyListings(): Promise<ListingDetail[]> {
  return await request<ListingDetail[]>(`/api/v1/listings/mine/`);
}

/* -------------------------------------------------------
   Fetch Listings (Generic)
------------------------------------------------------- */
export async function fetchListings(params?: {
  category_key?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<ListingSummary>> {
  const queryParams = new URLSearchParams();
  if (params?.category_key) {
    queryParams.append("category_key", params.category_key);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.page_size) {
    queryParams.append("page_size", params.page_size.toString());
  }

  const queryString = queryParams.toString();
  const url = `/api/v1/listings/${queryString ? `?${queryString}` : ""}`;

  return await request<PaginatedResponse<ListingSummary>>(url);
}

/* -------------------------------------------------------
   Fetch Partner Public Profile
------------------------------------------------------- */
export async function fetchPartnerPublicProfile(
  slug: string
): Promise<PartnerPublicProfile> {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const url = `${API_BASE_URL}/api/v1/partners/${slug}/`;

  const res = await fetch(url, {
    next: { revalidate: 60 }, // 60 saniyede bir yenile
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Partner profil bulunamadı: ${slug}`);
    }
    throw new Error(`Partner public profile fetch failed: ${res.status}`);
  }

  return await res.json();
}

/* -------------------------------------------------------
   Update Me (Profile Update)
------------------------------------------------------- */
export async function updateMe(payload: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  district?: string;
}): Promise<{ success: boolean; user: any; message?: string }> {
  return await request<{ success: boolean; user: any; message?: string }>(
    `/api/v1/accounts/me/`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }
  );
}

/* -------------------------------------------------------
   API Health Check
------------------------------------------------------- */
export const api = {
  health: {
    ping: async (): Promise<{ status: string }> => {
      try {
      const res = await request<{ status: string }>("/health/ping");
        return { status: res?.status ?? "ok" };
      } catch (err) {
        console.warn("health ping failed", err);
        return { status: "down" };
      }
    },
  },
};

/* -------------------------------------------------------
   Re-exports
------------------------------------------------------- */
export * from "./api/favorites";
export * from "./api/chat";
