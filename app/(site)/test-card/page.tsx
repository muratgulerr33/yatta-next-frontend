import SaleBoatCard, { SaleBoatCardProps } from "@/components/listing/SaleBoatCard";

// Mock data - Örnek tekne kartları için test verileri
const mockBoat: SaleBoatCardProps = {
  id: "1",
  slug: "princess-65-flybridge-luxury",
  title: "Princess 65 Flybridge - Lüks Yat",
  price: 12_500_000,
  currency: "TRY",
  location: "Bodrum, Muğla",
  specs: {
    length: 21,
    year: 2022,
    cabins: 4,
  },
  // TODO: Bu görselin gerçekten frontend/public altında olduğundan emin ol:
  // /frontend/public/satilik-tekneler.webp
  images: [
    "/satilik-tekneler.webp",
    "/satilik-tekneler.webp",
    "/satilik-tekneler.webp",
  ],
  isFavorite: false,
};

export default function TestCardPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="page-shell space-y-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Satılık Tekne Kartı Testi (V1)
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SaleBoatCard data={mockBoat} />
          <SaleBoatCard
            data={{
              ...mockBoat,
              id: "2",
              slug: "azimut-55-short-name",
              title: "Azimut 55 - Daha Kısa İsim",
              price: 8_500_000,
            }}
          />
          <SaleBoatCard
            data={{
              ...mockBoat,
              id: "3",
              slug: "sunseeker-manhattan-2024",
              title: "Sunseeker Manhattan 2024 Model Full+Full",
              price: 24_000_000,
              currency: "EUR",
              location: "Marmaris, Muğla",
              specs: {
                length: 28,
                year: 2024,
                cabins: 5,
              },
              isFavorite: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

