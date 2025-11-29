/**
 * API Client Helper - Next.js native fetch kullanır
 * SSR için optimize edilmiştir
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

/* -------------------------------------------------------
   Request Helper
------------------------------------------------------- */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
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
export async function fetchSaleListings(): Promise<ListingSummary[]> {
  const data = await request<PaginatedResponse<any>>(
    `/api/v1/listings/?category=sale&status=published`
  );

  return data.results.map((item) => {
    // cover_image_url için media array'inden is_cover olanı veya ilkini bul
    let cover_image_url: string | null = null;
    if (item.media && Array.isArray(item.media) && item.media.length > 0) {
      const coverMedia = item.media.find((m: any) => m.is_cover === true) || item.media[0];
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
  return await request<ListingDetail[]>(`/api/v1/listings/my/`);
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
    queryParams.append("category", params.category_key);
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
   API Health Check
------------------------------------------------------- */
export const api = {
  health: {
    ping: async (): Promise<{ status: string }> => {
      const res = await request<{ status: string }>("/health/ping");
      return res;
    },
  },
};
