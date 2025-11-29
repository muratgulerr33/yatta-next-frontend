import { fetchSaleListings, type ListingSummary } from "@/lib/api";
import { getMediaUrl } from "@/lib/media";
import SaleBoatCard, {
  SaleBoatCardProps,
} from "@/components/listing/SaleBoatCard";

function mapListingToCardProps(listing: ListingSummary): SaleBoatCardProps {
  const imageUrl = listing.cover_image_url 
    ? getMediaUrl(listing.cover_image_url) 
    : '/placeholder-boat.jpg';
  
  const location = [listing.city_display, listing.district_display]
    .filter(Boolean)
    .join(', ') || 'Konum belirtilmedi';

  const price = typeof listing.price === 'string' 
    ? parseFloat(listing.price) 
    : (listing.price || 0);
  
  const length = listing.length_overall || 0;

  return {
    id: String(listing.id),
    slug: listing.slug,
    title: listing.title,
    price,
    currency: (listing.currency as 'TRY' | 'EUR' | 'USD') || 'TRY',
    location,
    specs: {
      length,
      year: listing.year_built ?? 0,
      cabins: listing.cabins ?? 0,
    },
    images: [imageUrl],
    isFavorite: listing.is_favorite || false,
  };
}

export default async function SatilikTeknelerPage() {
  let listings: ListingSummary[] = [];
  let error: string | null = null;

  try {
    listings = await fetchSaleListings();
  } catch (err) {
    error = err instanceof Error ? err.message : 'İlanlar yüklenemedi';
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-10">
      <div className="page-shell space-y-6">
        <header className="space-y-1">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Kategori · Satılık tekneler
          </p>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Satılık Tekne & Yat İlanları
          </h1>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const cardProps = mapListingToCardProps(listing);
              return (
                <SaleBoatCard key={listing.id} data={cardProps} />
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-8 text-center">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              Bu kategoride henüz ilan yok.
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              İlk ilanı sen verebilirsin ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
