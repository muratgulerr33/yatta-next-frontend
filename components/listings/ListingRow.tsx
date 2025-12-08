'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';
import { deleteListing, Listing } from '@/lib/api/listings';
import { useToast } from '@/lib/hooks/use-toast';
import { Button } from '@/components/ui/Button';
import { ListingEditDialog } from './ListingEditDialog';

type Props = {
  listing: Listing;
  onUpdated: (listing: Listing) => void;
  onDeleted: (slug: string) => void;
};

export function ListingRow({ listing, onUpdated, onDeleted }: Props) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const ACTION_BUTTON_CLASS =
    "min-w-[70px] !h-auto px-3 py-1 text-xs !shadow-none";

  const handleDelete = async () => {
    if (!confirm(`'${listing.title}' başlıklı ilanı silmek istediğinize emin misiniz?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteListing(listing.slug);
      
      // Parent'a haber ver - bu component unmount olacak
      onDeleted(listing.slug);

      toast({
        title: 'İlan silindi',
        description: `'${listing.title}' başlıklı ilanınız silindi.`,
        variant: 'success',
      });
    } catch (error: any) {
      // Error handling - structured
      const errorMessage = 
        error?.message || 
        'İlan silinirken bir hata oluştu. Lütfen tekrar deneyin.';
      
      toast({
        title: 'Hata',
        description: errorMessage,
        variant: 'destructive',
      });
      
      setIsDeleting(false); // Sadece hata durumunda loading'i kapat
    }
    // Başarılı durumda setIsDeleting(false) çağırma:
    // Parent kartı listeden çıkarınca bu component unmount olacak
  };

  const statusLabels: Record<string, string> = {
    DRAFT: 'Taslak',
    PUBLISHED: 'Yayında',
    ARCHIVED: 'Arşiv',
    draft: 'Taslak',
    published: 'Yayında',
    archived: 'Arşiv',
  };

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-yellow-100 text-yellow-800',
    PUBLISHED: 'bg-green-100 text-green-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  const formatPrice = (price: number | null, currency: string, priceOnRequest: boolean) => {
    if (priceOnRequest) return 'Talep üzerine';
    if (!price) return 'Fiyat belirtilmemiş';
    return `${price.toLocaleString('tr-TR')} ${currency}`;
  };

  const handleCardClick = () => {
    router.push(`/ilan/${listing.slug}?from=profil`);
  };

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  return (
    <>
      <article 
        onClick={handleCardClick}
        className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer min-w-0 w-full"
      >
        {/* Kapak fotoğrafı */}
        <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {listing.media && listing.media.length > 0 ? (
            <Image
              src={listing.media[0].image}
              alt={listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              Fotoğraf yok
            </div>
          )}
        </div>

        {/* Metin alanı */}
        <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-900">
                {listing.title}
              </h3>
              <p className="text-xs text-gray-500">
                {listing.location_province && listing.location_district
                  ? `${listing.location_province}, ${listing.location_district}`
                  : 'Konum belirtilmedi'}
              </p>
              <p className="text-xs text-gray-500">
                {listing.length_m ? `${listing.length_m}m` : '-'} • {listing.year_built || '-'} • {listing.cabin_count ? `${listing.cabin_count} kabin` : '-'}
              </p>
            </div>

            {/* Statü badge */}
            <span
              className={clsx(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                listing.status === 'PUBLISHED' || listing.status === 'published'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-yellow-50 text-yellow-700'
              )}
            >
              {listing.status === 'PUBLISHED' || listing.status === 'published' ? 'Yayında' : 'Taslak'}
            </span>
          </div>

          {/* Alt satır: fiyat + aksiyonlar */}
          <div className="mt-1 flex items-center justify-between gap-2 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate min-w-0">
              {formatPrice(listing.price, listing.currency, listing.price_on_request)}
            </p>
            <div 
              className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Button 
                variant="outline" 
                size="xs" 
                onClick={handleEditClick}
                className={ACTION_BUTTON_CLASS}
              >
                Düzenle
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={handleDelete}
                disabled={isDeleting}
                className={`${ACTION_BUTTON_CLASS} !bg-red-600 hover:!bg-red-700 !text-white !border-none`}
              >
                {isDeleting ? 'Siliniyor...' : 'Sil'}
              </Button>
            </div>
          </div>
        </div>
      </article>

      {isEditOpen && (
        <ListingEditDialog
          listing={listing}
          onUpdated={(updated) => {
            onUpdated(updated);
            setIsEditOpen(false);
          }}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
}

