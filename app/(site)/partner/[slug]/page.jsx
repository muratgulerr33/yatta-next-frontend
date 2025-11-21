// app/partner/[slug]/page.jsx
import { notFound } from "next/navigation";
import { fetchPartnerPublicProfile } from "@/lib/api";

/**
 * SEO metadata generation
 * @param {{ params: Promise<{ slug: string }> }} props
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const partner = await fetchPartnerPublicProfile(slug);
    const title = `${partner.business_name} | YATTA`;
    const description =
      partner.description ??
      `YATTA üzerinden ${partner.business_name} için yat turları ve organizasyonları görüntüleyin.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "YATTA",
      },
    };
  } catch {
    return {
      title: "Partner bulunamadı | YATTA",
      description: "Aradığınız partner profili bulunamadı.",
    };
  }
}

/**
 * @param {{ params: Promise<{ slug: string }> }} props
 */
export default async function PartnerPublicProfilePage({ params }) {
  const { slug } = await params;
  let partner = null;

  try {
    partner = await fetchPartnerPublicProfile(slug);
  } catch (error) {
    // 404 veya server hatasında davranış
    return notFound();
  }

  if (!partner) {
    return notFound();
  }

  return (
    <section className="min-h-screen bg-white">
      <section className="px-4 py-8 md:px-8 md:py-12 max-w-4xl mx-auto">
        {/* Üst başlık alanı */}
        <header className="mb-6">
          <p className="text-xs text-gray-500 mb-1">Partner profili</p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
            {partner.business_name}
          </h1>
          {partner.city && (
            <p className="text-sm text-gray-600 mt-1">
              {partner.city}
              {partner.district ? `, ${partner.district}` : ""}
            </p>
          )}
        </header>

        {/* Ana içerik grid'i */}
        <div className="grid gap-6 md:grid-cols-[2fr,1.2fr]">
          {/* Sol: Açıklama + adres */}
          <div className="space-y-4">
            {partner.description && (
              <section>
                <h2 className="text-lg font-semibold mb-2 text-gray-900">Hakkında</h2>
                <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                  {partner.description}
                </p>
              </section>
            )}

            {(partner.address || partner.sector) && (
              <section>
                <h2 className="text-lg font-semibold mb-2 text-gray-900">Konum & Sektör</h2>
                {partner.sector && (
                  <p className="text-sm text-gray-800">
                    Sektör: {partner.sector}
                  </p>
                )}
                {partner.address && (
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                    Adres: {partner.address}
                  </p>
                )}
              </section>
            )}
          </div>

          {/* Sağ: İletişim kutusu */}
          <aside className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">İletişim</h2>
            {partner.phone && (
              <p className="text-sm text-gray-800">
                Telefon:{" "}
                <a
                  href={`tel:${partner.phone.replace(/[^0-9+]/g, "")}`}
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  {partner.phone}
                </a>
              </p>
            )}
            {partner.email && (
              <p className="text-sm text-gray-800">
                E-posta:{" "}
                <a
                  href={`mailto:${partner.email}`}
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  {partner.email}
                </a>
              </p>
            )}
            {/* İleride: CTA butonları (rezervasyon isteği, mesaj, vb.) buraya eklenebilir */}
          </aside>
        </div>
      </section>
    </section>
  );
}

