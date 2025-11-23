'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { buildMediaUrl } from '@/lib/utils/media';

interface Category {
  id: string;
  title: string;
  image: string;
  link: string;
  description?: string;
}

interface CategoryShowcaseProps {
  categories: Category[];
  title?: string;
  subtitle?: string;
}

export const CategoryShowcase = ({ categories, title, subtitle }: CategoryShowcaseProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: false
    },
    [
      Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
    ]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="w-full py-8 overflow-hidden">
      {(title || subtitle) && (
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          {title && <h2 className="text-2xl font-bold text-slate-900">{title}</h2>}
          {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
        </div>
      )}

      <div className="relative group">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0 pl-4"
              >
                <Link href={category.link} className="block h-full relative group/card">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <Image
                      src={buildMediaUrl(category.image)}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                      sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 group-hover/card:opacity-70 transition-opacity" />
                    
                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold text-white mb-1">{category.title}</h3>
                      {category.description && (
                        <p className="text-sm text-white/90 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-10 disabled:opacity-0"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-10 disabled:opacity-0"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

