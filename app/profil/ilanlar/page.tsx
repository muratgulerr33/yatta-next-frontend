'use client';

import { useEffect, useState, useCallback } from 'react';
import { getMyListings, Listing } from '@/lib/api/listings';
import { useToast } from '@/lib/hooks/use-toast';
import { ListingRow } from '@/components/listings/ListingRow';
import { Toaster } from '@/components/ui/Toaster';

export default function IlanlarPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyListings();
        setListings(data);
      } catch (error: any) {
        toast({
          title: 'Hata',
          description: 'İlanlarınız yüklenirken bir sorun oluştu.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const handleDeleted = useCallback((deletedSlug: string) => {
    setListings((currentListings) => {
      const updated = currentListings.filter((l) => l.slug !== deletedSlug);
      return updated;
    });
  }, []);

  const handleUpdated = useCallback((updated: Listing) => {
    setListings((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l))
    );
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">
          Tekne İlanlarım
        </h1>
        <p className="p-4 text-sm text-muted-foreground">İlanlarınız yükleniyor...</p>
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">
          Tekne İlanlarım
        </h1>
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-600">
            Henüz bir ilanınız yok. İlan vermek için üst menüden <strong>İlan Ver</strong> sekmesini kullanabilirsiniz.
          </p>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">
        Tekne İlanlarım
      </h1>
      {listings.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          Henüz bir ilanınız yok. İlk ilanınızı oluşturarak başlayabilirsiniz.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {listings.map((listing) => (
            <ListingRow
              key={listing.slug || listing.id}
              listing={listing}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
      <Toaster />
    </div>
  );
}

