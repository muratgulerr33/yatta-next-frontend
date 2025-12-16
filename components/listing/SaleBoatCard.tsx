"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
// TODO: lucide-react paketi package.json'a eklenmelidir
// Kurulum: npm install lucide-react
import { Heart, Ruler, Anchor, BedDouble, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { addFavorite, removeFavorite, getFavorites } from "@/lib/api/favorites";
import { ApiError } from "@/lib/api";
import { useToast } from "@/lib/hooks/use-toast";

export interface SaleBoatCardProps {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: "TRY" | "EUR" | "USD";
  location: string;
  specs: {
    length: number;
    year: number;
    cabins: number;
  };
  images: string[];
  isFavorite?: boolean;
  favoriteId?: number;
  position?: number;
  onRemoveFavorite?: () => void;
  onFavoriteChange?: (
    listingId: number,
    isFavorite: boolean,
    favoriteId: number | null
  ) => void;
}

export default function SaleBoatCard({ data }: { data: SaleBoatCardProps }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { toast } = useToast();

  // Favori state yönetimi
  const [favoriteId, setFavoriteId] = useState<number | null>(data.favoriteId ?? null);
  const [isFavorite, setIsFavorite] = useState<boolean>(data.isFavorite ?? false);
  const [isFavLoading, setIsFavLoading] = useState<boolean>(false);

  const coverImage = data.images?.[0];
  const extraImageCount = Math.max(0, (data.images?.length || 0) - 1);
  // Dev'de hydration riskini sıfırla, prod build'de LCP için çalışsın:
  const position = typeof data.position === "number" ? data.position : -1;
  const isLcpImage = process.env.NODE_ENV === "production" && position === 0;
  // Güvenli fallback: coverImage yoksa var olan bir görsel kullan
  const coverImageSrc = coverImage && coverImage.length > 0 ? coverImage : "/yatta-icon.webp";

  // Parent'tan gelen prop değişikliklerini dinle ve local state'i senkronize et
  useEffect(() => {
    setIsFavorite(data.isFavorite ?? false);
    setFavoriteId(data.favoriteId ?? null);
  }, [data.isFavorite, data.favoriteId]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleFavoriteClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    // Login kontrolü
    if (!user) {
      router.push(`/login?next=${pathname}`);
      return;
    }

    if (isFavLoading) return;
    setIsFavLoading(true);

    try {
      const listingId = Number(data.id); // id string ise Number() ile çevir

      if (!isFavorite) {
        // FAVORİYE EKLE
        const favorite = await addFavorite(listingId);

        setIsFavorite(true);
        setFavoriteId(favorite.id);

        // Parent'a bildir
        data.onFavoriteChange?.(listingId, true, favorite.id);

        toast({
          title: "Favorilere eklendi",
          description: "İlan favorilerinize eklendi.",
        });
      } else {
        // FAVORİDEN ÇIKAR
        if (!favoriteId) {
          // Güvenlik için: favori id bilinmiyorsa önce listeden çöz
          const favorites = await getFavorites();
          const existing = favorites.find(
            (fav) => fav.listing.id === listingId
          );
          if (!existing) {
            setIsFavorite(false);
            setIsFavLoading(false);
            return;
          }
          setFavoriteId(existing.id);
        }

        await removeFavorite(favoriteId!);
        setIsFavorite(false);
        setFavoriteId(null);

        // Parent'a bildir
        data.onFavoriteChange?.(listingId, false, null);

        toast({
          title: "Favorilerden kaldırıldı",
          description: "İlan favorilerinizden kaldırıldı.",
        });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // 401 ise login'e yönlendirme fallback
        if (err.status === 401) {
          router.push(`/login?next=${pathname}`);
        } else {
          toast({
            variant: "destructive",
            title: "İşlem başarısız",
            description: err.message,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "İşlem başarısız",
          description: "Favori işlemi sırasında bir hata oluştu.",
        });
      }
    } finally {
      setIsFavLoading(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/ilan/${data.slug}`);
  };

  const handleInspectClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`/ilan/${data.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col w-full bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* Görsel Alanı */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src={coverImageSrc}
          alt={data.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={isLcpImage}
        />
        {extraImageCount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
            +{extraImageCount} foto
          </span>
        )}

        {/* Favori Butonu */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={isFavLoading}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm text-[var(--color-text-secondary)] hover:bg-white hover:text-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-slate-500"
            }`}
          />
        </button>
      </div>

      {/* İçerik Alanı */}
      <div className="flex flex-col flex-1 p-4">
        {/* Lokasyon */}
        <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{data.location}</span>
        </div>

        {/* Başlık */}
        <h3 className="text-lg font-bold text-[var(--color-text-primary)] line-clamp-1 mb-3">
          {data.title}
        </h3>

        {/* Smart Chips */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 rounded-lg px-2">
          {/* Boy */}
          <div className="flex flex-col items-center justify-center">
            <Ruler className="w-4 h-4 text-[var(--color-text-secondary)] mb-1" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {data.specs.length}m
            </span>
          </div>

          {/* Yapım Yılı */}
          <div className="flex flex-col items-center justify-center border-l border-[var(--color-border)]">
            <Anchor className="w-4 h-4 text-[var(--color-text-secondary)] mb-1" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {data.specs.year}
            </span>
          </div>

          {/* Kabin */}
          <div className="flex flex-col items-center justify-center border-l border-[var(--color-border)]">
            <BedDouble className="w-4 h-4 text-[var(--color-text-secondary)] mb-1" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {data.specs.cabins} Kabin
            </span>
          </div>
        </div>

        {/* Fiyat + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-[var(--color-text-secondary)] mb-1">
              Satış Fiyatı
            </span>
            <span className="text-xl font-bold text-[var(--color-primary)] tracking-tight truncate">
              {formatPrice(data.price, data.currency)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleInspectClick}
            className="flex-shrink-0 inline-flex items-center rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/70 focus-visible:ring-offset-2"
            aria-label="İlanı incele"
          >
            İncele
          </button>
        </div>
      </div>
    </div>
  );
}

