import { CategoryComingSoon } from "@/components/ui/CategoryComingSoon";

export const metadata = {
  title: "Teknede Konaklama - Çok Yakında | Yatta.com.tr",
  description:
    "Marina içi teknede konaklama, romantik paketler ve kahvaltı dahil seçenekler çok yakında Yatta.com.tr'de.",
};

export default function KonaklamaPage() {
  return (
    <CategoryComingSoon
      categoryTitle="KONAKLAMA"
      title="Denizin Üzerinde Uyanmanın Ayrıcalığını Yaşayın"
      description="Sıradan bir otel odası yerine, dalga sesleriyle uyumak isteyenler için; teknede konaklama deneyimi Yatta güvencesiyle geliyor."
      highlights={[
        "🛏️ Marina içi tekne konaklaması",
        "🌙 Romantik konaklama paketleri",
        "🍳 Kahvaltı dahil seçenekler",
        "✨ Lüks ve konforlu kamaralar",
      ]}
      roadmapNote="V1: Mersin Marina'da seçili teknelerde konaklama"
    />
  );
}

