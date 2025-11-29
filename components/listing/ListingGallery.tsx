'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type { ListingMedia } from "@/lib/api";
import { getMediaUrl } from "@/lib/media";
import { X } from "lucide-react";

type ListingGalleryProps = {
  images: ListingMedia[];
  title: string;
};

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const SWIPE_THRESHOLD = 50;

  if (!images || images.length === 0) {
    return null;
  }

  // Media'yı sırala: is_cover önce, sonra order'a göre
  const sortedMedia = [...images].sort((a, b) => {
    if (a.is_cover) return -1;
    if (b.is_cover) return 1;
    return a.order - b.order;
  });

  const safeIndex = activeIndex >= sortedMedia.length ? 0 : activeIndex;
  const active = sortedMedia[safeIndex];

  const handleNext = useCallback(() => {
    if (!sortedMedia.length) return;
    setActiveIndex((prev) => (prev + 1) % sortedMedia.length);
  }, [sortedMedia.length]);

  const handlePrev = useCallback(() => {
    if (!sortedMedia.length) return;
    setActiveIndex((prev) =>
      prev === 0 ? sortedMedia.length - 1 : prev - 1
    );
  }, [sortedMedia.length]);

  // Klavye kısayolları
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrev();
      } else if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, handleNext, handlePrev]);

  // Thumbnail scroll into view
  useEffect(() => {
    if (!isFullscreen && thumbnailRefs.current[safeIndex]) {
      thumbnailRefs.current[safeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [safeIndex, isFullscreen]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const deltaX = touchStartX.current - touchEndX.current;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        // sola kaydırdı → sonraki foto
        handleNext();
      } else {
        // sağa kaydırdı → önceki foto
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      {/* Ana görsel + thumbnail strip */}
      <section className="space-y-3">
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="group relative block w-full overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]"
        >
          <div className="relative aspect-[4/3] sm:aspect-[16/9]">
            <Image
              src={getMediaUrl(active.image)}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(min-width: 1024px) 800px, 100vw"
            />
          </div>
        </button>

        {/* Thumbnail'ler */}
        {sortedMedia.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
            {sortedMedia.map((img, index) => (
              <button
                key={img.id ?? index}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  setIsFullscreen(true);
                }}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border snap-start transition-all ${
                  index === safeIndex
                    ? "border-[color:var(--color-primary)] scale-105"
                    : "border-[color:var(--color-border-subtle)]"
                }`}
              >
                <Image
                  src={getMediaUrl(img.image)}
                  alt={`${title} fotoğraf ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                {index === safeIndex && (
                  <div className="absolute inset-0 ring-2 ring-[color:var(--color-primary)] ring-offset-2 ring-offset-[color:var(--color-bg-primary)] pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 px-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={getMediaUrl(active.image)}
              alt={title}
              fill
              className="object-contain transition-opacity duration-300"
              sizes="100vw"
            />

            {/* Navigation buttons */}
            {sortedMedia.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white"
                  aria-label="Önceki fotoğraf"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white"
                  aria-label="Sonraki fotoğraf"
                >
                  ›
                </button>
              </>
            )}

            {/* Image counter */}
            {sortedMedia.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
                {safeIndex + 1} / {sortedMedia.length}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/90 hover:bg-white text-[color:var(--color-text-primary)] shadow-lg transition-all"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}

