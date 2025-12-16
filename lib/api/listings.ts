// lib/api/listings.ts
import { request } from '@/lib/api';

export type ListingStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'draft' | 'published' | 'archived';
export type Currency = 'TRY' | 'USD' | 'EUR';

export interface Listing {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number | null;
  currency: Currency;
  status: ListingStatus;
  category_key: string;
  category_label: string;
  boat_type: string;
  year_built: number | null;
  brand_name: string;
  length_m: number | null;
  beam_m?: number | null;
  capacity_people: number | null;
  cabin_count: number | null;
  hull_type: string;
  license_type: string;
  usage_type?: string;
  engine_count: number | null;
  engine_info_note?: string | null;
  fuel_type: string;
  seller_type: string;
  contact_phone: string;
  location_province: string;
  location_district: string;
  country_code: string;
  country_of_registry: string;
  price_on_request: boolean;
  created_at: string;
  updated_at: string;
  owner?: string;
  media?: Array<{
    id: number;
    image: string;
    is_cover?: boolean;
    order?: number;
  }>;
}

export interface ListingCreatePayload {
  title: string;
  description: string;
  price: number | null;
  currency: Currency;
  category_key: string;
  category_label: string;
  boat_type: string;
  year_built: number;
  brand_name: string;
  length_m: number;
  beam_m?: number;
  capacity_people: number;
  cabin_count: number;
  hull_type: string;
  license_type: string;
  usage_type?: string;
  engine_count: number;
  engine_info_note?: string | null;
  fuel_type: string;
  seller_type: string;
  contact_phone: string;
  location_province: string;
  location_district: string;
  country_code: string;
  country_of_registry: string;
  price_on_request: boolean;
}

export type ListingUpdatePayload = Partial<ListingCreatePayload> & {
  status?: ListingStatus;
};

export async function createListing(payload: ListingCreatePayload): Promise<Listing> {
  try {
    return await request<Listing>('/api/v1/listings/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error: any) {
    // Error handling - api.ts'deki request zaten error throw ediyor
    throw error;
  }
}

export async function getMyListings(): Promise<Listing[]> {
  try {
    const res = await request<{ results?: Listing[] } | Listing[]>('/api/v1/listings/mine/');
    // Pagination varsa results, yoksa direkt array
    return Array.isArray(res) ? res : (res.results ?? []);
  } catch (error: any) {
    throw error;
  }
}

export async function updateListing(slug: string, payload: ListingUpdatePayload): Promise<Listing> {
  try {
    return await request<Listing>(`/api/v1/listings/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  } catch (error: any) {
    throw error;
  }
}

export async function deleteListing(slug: string): Promise<void> {
  try {
    await request<void>(`/api/v1/listings/${slug}/`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    throw error;
  }
}

