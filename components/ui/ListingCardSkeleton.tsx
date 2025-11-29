export default function ListingCardSkeleton() {
  return (
    <div className="group relative flex flex-col w-full bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden animate-pulse">
      {/* Görsel Alanı */}
      <div className="relative aspect-[4/3] bg-gray-200" />

      {/* İçerik Alanı */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Lokasyon */}
        <div className="h-3 w-24 bg-gray-200 rounded" />

        {/* Başlık */}
        <div className="h-5 w-full bg-gray-200 rounded" />

        {/* Smart Chips */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 rounded-lg px-2">
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-8 bg-gray-200 rounded" />
        </div>

        {/* Fiyat */}
        <div className="h-6 w-32 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

