/**
 * app/(site)/ilan/[slug]/page.tsx — Satılık Tekne/Yat İlan Detay Sayfası
 *
 * Bu sayfa, satılık tekne/yat ilanlarının detay bilgilerini gösterir.
 * Gerçek backend API'den veri çekilir.
 *
 * TODO Checklist:
 * [ ] Donanım / ekipman listesi için backend alanı eklenince FeaturesSection gerçek veriye bağlanacak
 * [ ] Favori ve mesaj butonları gerçek aksiyonlara bağlanacak
 * [ ] V2'de harita component'i (ör. Leaflet) ile gerçek konum gösterimi eklenecek
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchListing, type ListingDetail } from "@/lib/api";
import { getMediaUrl } from "@/lib/media";
import { getCountryName } from "@/lib/utils/country-mapping";
import ListingGallery from "@/components/listing/ListingGallery";
import ListingActionSidebar from "@/components/listing/ListingActionSidebar";
import ListingPriceFavorite from "@/components/listing/ListingPriceFavorite";
import { ListingSellerCard } from "@/components/listing/ListingSellerCard";
import BreadcrumbNavClient from "@/components/ui/BreadcrumbNavClient";

// HTML <head> için meta/canonical/OG
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const listing = await fetchListing(slug);

    if (!listing) {
      return {
        title: "İlan Bulunamadı | YATTA",
        description: "Aradığınız ilan bulunamadı.",
      };
    }

    const description = listing.description
      ? listing.description.slice(0, 160)
      : `${listing.title} - YATTA'da satılık tekne/yat ilanı`;

    const coverImage = listing.media.find((m) => m.is_cover) || listing.media[0];
    const imageUrl = coverImage ? getMediaUrl(coverImage.image) : undefined;

    return {
      title: `${listing.title} | YATTA`,
      description,
      alternates: {
        canonical: `https://yatta.com.tr/ilan/${listing.slug}`,
      },
      openGraph: {
        title: `${listing.title} | YATTA`,
        description,
        url: `https://yatta.com.tr/ilan/${listing.slug}`,
        images: imageUrl ? [{ url: imageUrl }] : [],
        siteName: "YATTA",
        type: "website",
      },
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Request failed: 404")
    ) {
      // 404 için anlamlı metadata döndür
      return {
        title: "İlan Bulunamadı | YATTA",
        description: "Aradığınız ilan bulunamadı.",
      };
    }

    // Diğer hatalar global error boundary'e gitsin
    throw error;
  }
}

// Component Definitions
function BreadcrumbNav({ listing }: { listing: ListingDetail }) {
  return <BreadcrumbNavClient listing={listing} />;
}


function ListingHeader({ listing }: { listing: ListingDetail }) {
  const locationParts = [
    listing.location_province,
    listing.location_district,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="space-y-3">
      {/* Başlık */}
      <h1 
        className="text-2xl sm:text-3xl font-bold text-[color:var(--color-text-primary)]"
        title={listing.title}
      >
        {listing.title}
      </h1>

      {/* Konum ve Yıl */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--color-text-secondary)]">
        {locationParts && (
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span>{locationParts}</span>
          </div>
        )}
        {listing.year_built && (
          <div className="flex items-center gap-1.5">
            <span>Yıl:</span>
            <span className="font-medium">{listing.year_built}</span>
          </div>
        )}
      </div>

      {/* Bölge 1: Fiyat + Favori */}
      <ListingPriceFavorite listing={listing} />
    </div>
  );
}

function QuickSpecsBar({ listing }: { listing: ListingDetail }) {
  return (
    <div className="bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border)] rounded-xl p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {listing.length_m && (
          <div className="flex flex-col items-center text-center">
            <div className="text-xs uppercase text-[color:var(--color-text-secondary)] mb-1">
              Uzunluk
            </div>
            <div className="text-sm font-semibold text-[color:var(--color-text-primary)]">
              {typeof listing.length_m === "number"
                ? listing.length_m
                : parseFloat(String(listing.length_m))}m
            </div>
          </div>
        )}
        {listing.year_built && (
          <div className="flex flex-col items-center text-center">
            <div className="text-xs uppercase text-[color:var(--color-text-secondary)] mb-1">
              Yıl
            </div>
            <div className="text-sm font-semibold text-[color:var(--color-text-primary)]">
              {listing.year_built}
            </div>
          </div>
        )}
        {listing.cabin_count && (
          <div className="flex flex-col items-center text-center">
            <div className="text-xs uppercase text-[color:var(--color-text-secondary)] mb-1">
              Kabin
            </div>
            <div className="text-sm font-semibold text-[color:var(--color-text-primary)]">
              {listing.cabin_count}
            </div>
          </div>
        )}
        {listing.capacity_people && (
          <div className="flex flex-col items-center text-center">
            <div className="text-xs uppercase text-[color:var(--color-text-secondary)] mb-1">
              Misafir
            </div>
            <div className="text-sm font-semibold text-[color:var(--color-text-primary)]">
              {listing.capacity_people}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ListingDescription({ listing }: { listing: ListingDetail }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-[color:var(--color-text-primary)]">
        Satıcı Açıklaması
      </h2>
      {listing.description ? (
        <>
          <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
            {listing.description}
          </p>
        </>
      ) : (
        <p className="text-sm text-[color:var(--color-text-secondary)] italic">
          Açıklama bulunmamaktadır.
        </p>
      )}
    </div>
  );
}

function SpecsSection({ listing }: { listing: ListingDetail }) {
  const specs = [];

  if (listing.length_m) {
    const lengthValue =
      typeof listing.length_m === "number"
        ? listing.length_m
        : parseFloat(String(listing.length_m));
    specs.push({ label: "Uzunluk", value: `${lengthValue}m` });
  }

  if (listing.beam_m) {
    const beamValue =
      typeof listing.beam_m === "number"
        ? listing.beam_m
        : parseFloat(String(listing.beam_m));
    specs.push({ label: "Genişlik", value: `${beamValue}m` });
  }

  if (listing.year_built) {
    specs.push({ label: "Yapım Yılı", value: listing.year_built.toString() });
  }

  if (listing.brand_name) {
    specs.push({ label: "Marka", value: listing.brand_name });
  }

  if (listing.model_name) {
    specs.push({ label: "Model", value: listing.model_name });
  }

  if (listing.engine_count) {
    specs.push({
      label: "Motor Sayısı",
      value: listing.engine_count.toString(),
    });
  }

  if (listing.fuel_type) {
    specs.push({ label: "Yakıt Tipi", value: listing.fuel_type });
  }

  if (listing.engine_info_note) {
    specs.push({ label: "Motor bilgisi", value: listing.engine_info_note });
  }

  if (listing.hull_type) {
    specs.push({ label: "Gövde Tipi", value: listing.hull_type });
  }

  if (listing.license_type) {
    specs.push({ label: "Ruhsat Tipi", value: listing.license_type });
  }

  if (listing.country_of_registry) {
    specs.push({
      label: "Bayrağı",
      value: getCountryName(listing.country_of_registry),
    });
  }

  if (specs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[color:var(--color-text-primary)]">
        Teknik Özellikler
      </h2>
      <div className="bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[color:var(--color-border)]">
          {specs.map((spec, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border-b last:border-b-0 sm:border-b-0 border-[color:var(--color-border)]"
            >
              <span className="text-sm text-[color:var(--color-text-secondary)]">
                {spec.label}
              </span>
              <span className="text-sm font-semibold text-[color:var(--color-text-primary)] text-right">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturesSection({ listing }: { listing: ListingDetail }) {
  // Şimdilik placeholder - backend'de donanım listesi yok
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[color:var(--color-text-primary)]">
        Donanım & Ekipman
      </h2>
      <p className="text-sm text-[color:var(--color-text-secondary)] italic">
        Donanım bilgileri yakında eklenecektir.
      </p>
    </div>
  );
}

function LocationSection({ listing }: { listing: ListingDetail }) {
  const locationParts = [
    listing.location_province,
    listing.location_district,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[color:var(--color-text-primary)]">
        Konum
      </h2>
      <div className="aspect-[16/9] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] flex items-center justify-center">
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          Harita Placeholder
        </p>
      </div>
      {locationParts && (
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          {locationParts}
        </p>
      )}
    </div>
  );
}




export default async function ListingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isFromProfile = resolvedSearchParams?.from === "profil";
  
  try {
    const listing = await fetchListing(slug);

    if (!listing) {
      notFound();
    }

  // Seller bilgilerini çıkar
  const sellerName = listing.owner || "Satıcı";

  const sellerTypeLabels: Record<string, string> = {
    owner: "Sahibinden",
    realtor: "Emlakçıdan",
    broker: "Broker",
    other: "Diğer",
  };

  const sellerSubtitle =
    listing.seller_type && sellerTypeLabels[listing.seller_type]
      ? sellerTypeLabels[listing.seller_type]
      : listing.seller_type || "Üye";

  const rawPhone = listing.contact_phone ?? null;

  const phoneHref = rawPhone ? `tel:${rawPhone}` : undefined;

  // Avatar URL şimdilik null (API'de profil fotoğrafı yok)
  const avatarUrl = null;

  // Media'yı sırala: is_cover önce, sonra order'a göre
  const sortedMedia = [...listing.media].sort((a, b) => {
    if (a.is_cover) return -1;
    if (b.is_cover) return 1;
    return a.order - b.order;
  });

  const coverImage = sortedMedia[0];
  const imageUrls = sortedMedia.map((m) => getMediaUrl(m.image));

  // JSON-LD Schema Markup (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description || `${listing.title} - YATTA'da satılık tekne/yat ilanı`,
    image: imageUrls.length > 0 ? imageUrls : undefined,
    brand: {
      "@type": "Brand",
      name: listing.brand_name || "YATTA",
    },
    offers: {
      "@type": "Offer",
      price: listing.price_on_request
        ? undefined
        : String(listing.price || 0),
      priceCurrency: listing.currency || "TRY",
      availability: listing.status === "published"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://yatta.com.tr/ilan/${listing.slug}`,
    },
    ...(listing.location_province && {
      areaServed: {
        "@type": "City",
        name: listing.location_province,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-bg-primary)] pb-6 lg:pb-12">
      <div className="page-shell py-4 sm:pt-6">
        {isFromProfile && (
          <div className="mb-4">
            <Link
              href="/profil/ilanlar"
              className="inline-flex items-center text-sm text-[color:var(--color-primary)] hover:underline"
            >
              ← İlanlarıma geri dön
            </Link>
          </div>
        )}
        <BreadcrumbNav listing={listing} />

        <main className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
          {/* Sol Kolon - İçerik */}
          <div className="space-y-6 lg:space-y-8">
            <ListingGallery images={listing.media} title={listing.title} />
            <ListingHeader listing={listing} />
            <QuickSpecsBar listing={listing} />
            <ListingDescription listing={listing} />

            {/* Satıcı Kartı */}
            <div className="my-6">
              <ListingSellerCard
                sellerName={sellerName}
                sellerSubtitle={sellerSubtitle}
                phoneNumber={rawPhone ?? undefined}
                phoneHref={phoneHref}
                ownerId={listing.owner_id}
                avatarUrl={avatarUrl}
              />
            </div>

            <SpecsSection listing={listing} />
            <FeaturesSection listing={listing} />
            <LocationSection listing={listing} />
          </div>

          {/* Sağ Kolon - Desktop Sticky Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <ListingActionSidebar listing={listing} />
            </div>
          </aside>
        </main>
      </div>

      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Request failed: 404")
    ) {
      // Kayıt yok → 404 sayfasına yönlendir
      notFound();
    }

    // Diğer hatalar için mevcut error flow kalsın
    throw error;
  }
}
