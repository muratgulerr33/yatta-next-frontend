import { CategoryComingSoon } from "@/components/ui/CategoryComingSoon";

export const metadata = {
  title: "Tekne Turları - Çok Yakında | Yatta.com.tr",
  description:
    "Mersin tekne turları, yüzme turları ve özel gün kutlamaları çok yakında Yatta.com.tr'de.",
};

export default function TurlarPage() {
  return (
    <CategoryComingSoon
      categoryTitle="TURLAR"
      title="Mersin'in En Güzel Koyları Çok Yakında Keşfedilmeyi Bekliyor"
      description="Gün batımı turlarından yüzme molalı gezilere kadar; size en uygun tekne turunu kolayca seçebileceğiniz sistemimiz hazırlanıyor."
      highlights={[
        "🌅 Gün batımı özel turları",
        "🏊‍♂️ Yüzme molalı günlük turlar",
        "🍽️ Yemekli tekne gezileri",
        "🎉 Gruplara özel kapalı turlar",
      ]}
      roadmapNote="V1: Mersin çıkışlı turlar"
    />
  );
}

