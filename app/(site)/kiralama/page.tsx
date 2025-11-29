import { CategoryComingSoon } from "@/components/ui/CategoryComingSoon";

export const metadata = {
  title: "Tekne & Yat Kiralama - Çok Yakında | Yatta.com.tr",
  description:
    "Saatlik veya günlük; kaptanlı veya kaptansız tekne ve yat kiralama seçenekleri çok yakında Yatta.com.tr'de.",
};

export default function KiralamaPage() {
  return (
    <CategoryComingSoon
      categoryTitle="KİRALAMA"
      title="Hayalinizdeki Tekneye Ulaşmak Artık Çok Kolay"
      description="Saatlik veya günlük; kaptanlı veya kaptansız. İhtiyacınıza ve bütçenize en uygun tekneyi bulabileceğiniz kiralama platformumuz açılıyor."
      highlights={[
        "⚓ Saatlik tekne kiralama",
        "🛥️ Günlük lüks yat kiralama",
        "👨‍✈️ Kaptanlı ve personelli seçenekler",
        "📅 Anında müsaitlik kontrolü",
      ]}
      roadmapNote="V1: Mersin ve yakın marinelerde kiralama seçenekleri"
    />
  );
}
