import { ListingWizard } from "@/components/listing/ListingWizard";

export default function SatilikTekneIlanVerPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Satılık Tekne / Yat İlanı Ver
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Adım adım ilerleyerek tekne ilanınızı kolayca oluşturun.
        </p>

        <div className="mt-6">
          <ListingWizard />
        </div>
      </div>
    </main>
  );
}

