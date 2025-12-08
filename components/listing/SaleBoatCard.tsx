"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
  onRemoveFavorite?: () => void;
  onFavoriteChange?: (
    listingId: number,
    isFavorite: boolean,
    favoriteId: number | null
  ) => void;
}

export default function SaleBoatCard({ data }: { data: SaleBoatCardProps }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { toast } = useToast();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Favori state yönetimi
  const [favoriteId, setFavoriteId] = useState<number | null>(data.favoriteId ?? null);
  const [isFavorite, setIsFavorite] = useState<boolean>(data.isFavorite ?? false);
  const [isFavLoading, setIsFavLoading] = useState<boolean>(false);

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

  const handleNext = () => {
    if (!data.images?.length) return;
    setCurrentImgIndex((prev) => (prev + 1) % data.images.length);
  };

  const handlePrev = () => {
    if (!data.images?.length) return;
    setCurrentImgIndex((prev) =>
      prev === 0 ? data.images.length - 1 : prev - 1,
    );
  };

  const handlePrevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handlePrev();
  };

  const handleNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleNext();
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

  const handleDotClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex(index);
  };

  const handleInspectClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`/ilan/${data.slug}`);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }

    const deltaX = touchEndX.current - touchStartX.current;
    const threshold = 40; // minimum swipe mesafesi (px)

    if (deltaX > threshold) {
      // sağa kaydırma → önceki foto
      handlePrev();
    } else if (deltaX < -threshold) {
      // sola kaydırma → sonraki foto
      handleNext();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const hasMultipleImages = data.images.length > 1;

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col w-full bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* Görsel Alanı */}
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {data.images[currentImgIndex] && (
          <Image
            src={data.images[currentImgIndex]}
            alt={data.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={currentImgIndex === 0}
          />
        )}

        {/* Navigasyon Okları */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Önceki fotoğraf"
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white text-xs shadow hover:bg-black/70"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Sonraki fotoğraf"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white text-xs shadow hover:bg-black/70"
            >
              ›
            </button>
          </>
        )}

        {/* Dots (Görsel Sayacı) */}
        {hasMultipleImages && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1 z-20">
            {data.images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => handleDotClick(e, index)}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                  index === currentImgIndex
                    ? "bg-white"
                    : "bg-white/40"
                }`}
                aria-label={`Fotoğraf ${index + 1}`}
              />
            ))}
          </div>
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

