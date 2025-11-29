"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// TODO: lucide-react paketi package.json'a eklenmelidir
// Kurulum: npm install lucide-react
import { Heart, Ruler, Anchor, BedDouble, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

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
}

export default function SaleBoatCard({ data }: { data: SaleBoatCardProps }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePrevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentImgIndex > 0) {
      setCurrentImgIndex((prev) => prev - 1);
    }
  };

  const handleNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentImgIndex < data.images.length - 1) {
      setCurrentImgIndex((prev) => prev + 1);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (data.isFavorite && data.onRemoveFavorite) {
      data.onRemoveFavorite();
    } else {
      console.log("Favoriye eklendi:", data.id);
    }
  };

  const hasMultipleImages = data.images.length > 1;
  const canGoPrev = hasMultipleImages && currentImgIndex > 0;
  const canGoNext = hasMultipleImages && currentImgIndex < data.images.length - 1;

  return (
    <div className="group relative flex flex-col w-full bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Görsel Alanı */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
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
              onClick={handlePrevImage}
              className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-primary)] transition-all duration-200 ${
                canGoPrev ? "opacity-0 group-hover:opacity-100" : "opacity-0 cursor-not-allowed"
              }`}
              aria-label="Önceki görsel"
              disabled={!canGoPrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextImage}
              className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-primary)] transition-all duration-200 ${
                canGoNext ? "opacity-0 group-hover:opacity-100" : "opacity-0 cursor-not-allowed"
              }`}
              aria-label="Sonraki görsel"
              disabled={!canGoNext}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots (Görsel Sayacı) */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {data.images.map((_, index) => (
              <button
                key={index}
                className={`rounded-full transition-all duration-200 ${
                  index === currentImgIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
                }`}
                style={{ height: "6px" }}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImgIndex(index);
                }}
                aria-label={`Görsel ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Favori Butonu */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm text-[var(--color-text-secondary)] hover:bg-white hover:text-red-500 transition-colors duration-200"
          aria-label={data.isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              data.isFavorite ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>
      </div>

      {/* İçerik Alanı */}
      <Link
        href={`/ilan/${data.slug}`}
        className="flex flex-col flex-1 p-4"
      >
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
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-[var(--color-text-secondary)] mb-1">
              Satış Fiyatı
            </span>
            <span className="text-xl font-bold text-[var(--color-primary)] tracking-tight">
              {formatPrice(data.price, data.currency)}
            </span>
          </div>
          <div className="text-[var(--color-primary)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            İncele →
          </div>
        </div>
      </Link>
    </div>
  );
}

