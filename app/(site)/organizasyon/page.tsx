import { CategoryComingSoon } from "@/components/ui/CategoryComingSoon";

export const metadata = {
  title: "Teknede Organizasyonlar - Çok Yakında | Yatta.com.tr",
  description:
    "Evlilik teklifi, doğum günü, kurumsal etkinlik ve daha fazlası için deniz üzerindeki özel organizasyonlar çok yakında Yatta.com.tr'de.",
};

export default function OrganizasyonPage() {
  return (
    <CategoryComingSoon
      categoryTitle="ORGANİZASYON"
      title="En Özel Anlarınızı Denizin Mavisiyle Taçlandırın"
      description="Evlilik teklifi, doğum günü veya kurumsal etkinlikler... Kusursuz organizasyonlar için tekneler ve paketler hazırlanıyor."
      highlights={[
        "💍 Evlilik teklifi organizasyonları",
        "🎂 Doğum günü partileri",
        "💼 Kurumsal yemek ve toplantılar",
        "👰 Bekarlığa veda partileri",
      ]}
      roadmapNote="V1: Mersin çıkışlı özel organizasyon paketleri"
    />
  );
}

