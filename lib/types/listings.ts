import { Listing, ListingUpdatePayload } from '@/lib/api/listings';

export type ListingFormValues = {
  // Adım 1 – Kimlik & Konum
  boat_type: string;
  brand_name: string;
  model_name: string;
  year_built: number | null;
  location_province: string;
  location_district: string;
  license_type: string;
  country_of_registry: string;

  // Adım 2 – Teknik
  length_m: number | null;
  beam_m: number | null;
  capacity_people: number | null;
  cabin_count: number | null;
  engine_count: number | null;
  engine_info_note?: string | null;
  fuel_type: string;
  hull_type: string;

  // Adım 3 – Hikaye & Fiyat
  title: string;
  description: string;
  price_on_request: boolean;
  price: number | null;
  currency: "TRY" | "USD" | "EUR";

  // Adım 4 – Fotoğraflar (edit modal'da kullanılmayacak)
  photos: File[];

  // Adım 5 – Satıcı
  seller_type: "owner" | "realtor" | "broker" | "other";
  contact_phone: string;
};

/**
 * Listing API response'unu form değerlerine map eder
 */
export function mapListingToFormValues(listing: Listing): ListingFormValues {
  return {
    boat_type: listing.boat_type || "",
    brand_name: listing.brand_name || "",
    model_name: listing.model_name || "",
    year_built: listing.year_built ?? null,
    location_province: listing.location_province || "",
    location_district: listing.location_district || "",
    license_type: listing.license_type || "özel",
    country_of_registry: listing.country_of_registry || "Türkiye",
    length_m: listing.length_m ?? null,
    beam_m: listing.beam_m ?? null,
    capacity_people: listing.capacity_people ?? null,
    cabin_count: listing.cabin_count ?? null,
    engine_count: listing.engine_count ?? 1,
    engine_info_note: listing.engine_info_note || null,
    fuel_type: listing.fuel_type || "dizel",
    hull_type: listing.hull_type || "",
    title: listing.title || "",
    description: listing.description || "",
    price_on_request: listing.price_on_request ?? false,
    price: listing.price ?? null,
    currency: listing.currency || "TRY",
    photos: [], // Edit modal'da medya ayrı akış
    seller_type: (listing.seller_type as any) || "owner",
    contact_phone: listing.contact_phone || "",
  };
}

/**
 * Form değerlerini API update payload formatına çevirir
 */
export function mapFormValuesToUpdatePayload(
  values: ListingFormValues
): ListingUpdatePayload {
  return {
    title: values.title,
    description: values.description || "",
    price: values.price_on_request ? null : (values.price ? Number(values.price) : null),
    currency: values.currency,
    boat_type: values.boat_type,
    year_built: values.year_built ? Number(values.year_built) : undefined,
    brand_name: values.brand_name,
    model_name: values.model_name,
    length_m: values.length_m ? Number(values.length_m) : undefined,
    beam_m: values.beam_m ? Number(values.beam_m) : undefined,
    capacity_people: values.capacity_people ? Number(values.capacity_people) : undefined,
    cabin_count: values.cabin_count ? Number(values.cabin_count) : undefined,
    hull_type: values.hull_type,
    license_type: values.license_type,
    engine_count: values.engine_count ? Number(values.engine_count) : undefined,
    engine_info_note: values.engine_info_note || null,
    fuel_type: values.fuel_type,
    seller_type: values.seller_type,
    contact_phone: values.contact_phone,
    location_province: values.location_province,
    location_district: values.location_district,
    country_of_registry: values.country_of_registry,
    price_on_request: values.price_on_request,
  };
}
