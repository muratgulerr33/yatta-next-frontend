// app/kiralama/[slugId]/page.tsx — Dinamik detay + JSON-LD + canonical
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { parseSlugId, buildSlugId, normalizeSlug } from "@/lib/slugId";

// Mock veri çekimi (ileride gerçek API ile değiştirilecek)
async function fetchRentalById(id: number) {
  // TODO: gerçek API: https://api.yatta.com.tr/rentals/{id}
  if (id < 1) return null;
  return {
    id,
    name: "Lorhan Yat — 1 Saatlik",
    description: "Boğaz turu için lüks yat, 1 saatlik deneyim.",
    images: ["/images/sample/lorhan-1.jpg"],
    price: 2500,
    currency: "TRY",
    sku: `RENT-${id}`,
    brand: "Yatta",
    availability: "https://schema.org/InStock",
    location: "İstanbul",
  };
}

function canonicalFor(slugId: string) {
  return `https://yatta.com.tr/kiralama/${slugId}`;
}

// HTML <head> için meta/canonical/OG
export async function generateMetadata(
  { params }: { params: Promise<{ slugId: string }> }
): Promise<Metadata> {
  const { slugId } = await params;
  const { slug, id } = parseSlugId(slugId);
  if (!slug || !id) return { title: "Bulunamadı | YATTA" };

  const data = await fetchRentalById(id);
  if (!data) return { title: "Bulunamadı | YATTA" };

  const canonSlugId = buildSlugId(data.name, data.id);
  const canonUrl = canonicalFor(canonSlugId);

  return {
    title: `${data.name} | YATTA`,
    description: data.description,
    alternates: { canonical: canonUrl },
    openGraph: {
      title: `${data.name} | YATTA`,
      description: data.description,
      url: canonUrl,
      images: data.images?.slice(0, 1).map((u) => ({ url: u })),
      siteName: "YATTA",
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slugId: string }> }) {
  const { slugId } = await params;
  const { slug, id } = parseSlugId(slugId);
  if (!slug || !id) return notFound();

  const data = await fetchRentalById(id);
  if (!data) return notFound();

  // URL slug'ı veri adından üretilenle uyuşmuyorsa doğru kanoniğe gönder
  const expectedSlugId = buildSlugId(data.name, data.id);
  if (normalizeSlug(slugId) !== normalizeSlug(expectedSlugId)) {
    // Next redirect 307/308 olabilir; SEO için canonical zaten doğru.
    redirect(`/kiralama/${expectedSlugId}`);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description,
    image: data.images,
    sku: data.sku,
    brand: { "@type": "Brand", name: data.brand },
    offers: {
      "@type": "Offer",
      price: String(data.price),
      priceCurrency: data.currency,
      availability: data.availability,
      url: canonicalFor(expectedSlugId),
    },
  };

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">{data.name}</h1>
      <p className="opacity-80 mb-4">{data.description}</p>
      <div className="mb-6 text-sm">Konum: {data.location}</div>
      <div className="border rounded-xl p-4 inline-block">
        <div className="text-lg font-medium">{data.price} {data.currency}</div>
        <button className="mt-2 px-4 py-2 rounded-xl bg-black text-white">Rezervasyon Talebi</button>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

